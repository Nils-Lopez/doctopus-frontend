import { useCallback, useEffect, useReducer, useRef } from "react";

import {
  apiFetch,
  API_BASE_URL,
  buildDefaultHeaders,
} from "../../middlewares/apiFetch";

const STORAGE_KEY = "doctopus.doc.export.job";
const ACTIVE_STATUSES = new Set(["queued", "running", "retrying"]);

const initialState = {
  job: null,
  loading: false,
  error: null,
  downloading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_JOB":
      return { ...state, job: action.job };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_DOWNLOADING":
      return { ...state, downloading: action.value };
    default:
      return state;
  }
}

function persistJob(job) {
  if (typeof window === "undefined") return;
  if (!job) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(job));
  }
}

function readStoredJob() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function useDocExportJob() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isMounted = useRef(true);

  const setJob = useCallback((job) => {
    persistJob(job);
    if (!isMounted.current) return;
    dispatch({ type: "SET_JOB", job });
  }, []);

  const setError = useCallback((error) => {
    if (!isMounted.current) return;
    dispatch({ type: "SET_ERROR", error });
  }, []);

  const setLoading = useCallback((value) => {
    if (!isMounted.current) return;
    dispatch({ type: "SET_LOADING", value });
  }, []);

  const setDownloading = useCallback((value) => {
    if (!isMounted.current) return;
    dispatch({ type: "SET_DOWNLOADING", value });
  }, []);

  const clearJob = useCallback(() => {
    persistJob(null);
    if (!isMounted.current) return;
    dispatch({ type: "SET_JOB", job: null });
  }, []);

  const fetchStatus = useCallback(
    async (jobId, { silent = false } = {}) => {
      if (!jobId) return;
      if (!silent) {
        setLoading(true);
      }
      try {
        const response = await apiFetch(`/docs/export/${jobId}`);
        if (!response || response === "Not Found") {
          throw new Error("Impossible de récupérer le statut de l'export.");
        }
        if (response.success !== true) {
          throw new Error(
            response.message ||
              "Impossible de récupérer le statut de l'export."
          );
        }
        setJob(response.data);
        setError(null);
      } catch (err) {
        setError(
          err.message || "Impossible de récupérer le statut de l'export."
        );
        if (
          err.message &&
          (err.message.includes("404") || err.message.includes("not found"))
        ) {
          clearJob();
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [setJob, setError, setLoading, clearJob]
  );

  const startExport = useCallback(async () => {
    if (state.loading || state.downloading) return;
    if (state.job && ACTIVE_STATUSES.has(state.job.status)) {
      setError("Un export est déjà en cours.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await apiFetch("/docs/export", { method: "POST" });
      if (!response || response.success !== true) {
        throw new Error(
          (response && response.message) ||
            "Impossible de démarrer l'export."
        );
      }
      setJob(response.data);
      if (response.data?.id) {
        fetchStatus(response.data.id, { silent: true }).catch(() => {});
      }
    } catch (err) {
      setError(err.message || "Impossible de démarrer l'export.");
    } finally {
      setLoading(false);
    }
  }, [
    state.loading,
    state.downloading,
    state.job,
    setJob,
    setError,
    setLoading,
    fetchStatus,
  ]);

  const downloadExport = useCallback(async () => {
    const job = state.job;
    if (!job || job.status !== "completed") {
      setError("L'export n'est pas encore prêt.");
      return;
    }
    if (!job.result || !job.result.filePath) {
      setError("Le fichier d'export n'est plus disponible.");
      return;
    }

    setError(null);
    setDownloading(true);
    try {
      const headers = {
        ...buildDefaultHeaders(),
        Accept: "text/csv",
      };
      const response = await fetch(
        `${API_BASE_URL}/docs/export/${job.id}/download`,
        {
          method: "GET",
          headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        let message = "Le téléchargement de l'export a échoué.";
        if (response.status === 410) {
          message =
            "Le fichier d'export a expiré. Merci de lancer un nouvel export.";
        } else if (response.status === 403) {
          message = "Vous n'êtes pas autorisé à télécharger cet export.";
        } else if (response.status === 409) {
          message = "L'export est toujours en cours. Patientez un instant.";
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = job.result?.fileName || `docs_export_${job.id}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);

      clearJob();
    } catch (err) {
      setError(
        err.message || "Le téléchargement de l'export a échoué."
      );
    } finally {
      setDownloading(false);
    }
  }, [state.job, clearJob, setError, setDownloading]);

  const resumeJob = useCallback(
    (job) => {
      if (!job) return;
      setJob(job);
      fetchStatus(job.id, { silent: true }).catch(() => {
        // errors handled in fetchStatus
      });
    },
    [setJob, fetchStatus]
  );

  useEffect(() => {
    const storedJob = readStoredJob();
    if (storedJob) {
      resumeJob(storedJob);
    }
  }, [resumeJob]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const job = state.job;
    if (!job || !ACTIVE_STATUSES.has(job.status)) {
      return undefined;
    }
    const interval = setInterval(() => {
      fetchStatus(job.id, { silent: true }).catch(() => {
        // Fetch errors handled inside fetchStatus
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [state.job, fetchStatus]);

  return {
    job: state.job,
    loading: state.loading,
    error: state.error,
    downloading: state.downloading,
    startExport,
    downloadExport,
    refreshStatus: () =>
      state.job ? fetchStatus(state.job.id, { silent: false }) : null,
    clearJob,
  };
}
