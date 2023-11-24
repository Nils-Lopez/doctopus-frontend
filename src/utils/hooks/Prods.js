import { useReducer } from "react";
import { apiFetch } from "../middlewares/apiFetch";

function reducer(state, action) {
  switch (action.type) {
    case "FindByIds":
      return { ...state, responseFindByIds: action.payload };
    case "FindByString":
      return { ...state, responseFindProdsByString: action.payload };
    case "FindEntityByName":
      return { ...state, responseFindEntityByName: action.payload };
    case "FindPersonByName":
      return { ...state, responseFindPersonByName: action.payload };
    case "FindProdRelsById":
      return { ...state, responseFindProdRelsById: action.payload };
    default:
      throw new Error("Action inconnue" + action.type);
  }
}

const useProds = () => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    responseFindProdByIds: null,
    responseFindProdsByString: null,
    responseFindEntityByName: null,
    responseFindPersonByName: null,
    responseFindProdRelsById: null
  });
  
  return {
    responseFindProdByIds: state.responseFindByIds,
    responseFindProdsByString: state.responseFindProdsByString,
    responseFindEntityByName: state.responseFindEntityByName,
    responseFindProdRelsById: state.responseFindProdRelsById,
    responseFindPersonByName: state.responseFindPersonByName,
    findProdByIds: async function (ids) {
      const prods = [];
      await Promise.all(
        ids.map(async (id) => {
          const production = await fetch(
            "https://api.aml-cfwb.be/scapin/spectacle.svc/anon/get/" + id,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                appName: "CDOctopus",
              },
              mode: "cors",
            }
          ).then(function (response) {
            return response.json();
          });

          if (production && production[0]) {
            const prodSchema = {
              prod: {
                _id: production[0].ID,
                title: production[0].Titre,
                description: production[0].CommentairesResume,
                duration: production[0].Duree,
                date: production[0].Saison,
                publishedAt: production[0].DatePremiere,
                location: production[0].LieuPremiere,
              },
            };
          

            const prod = {
              item: prodSchema,
              scapin: true,
            };
            let alreadyIn = false;
            prods.map((p) => {
              if (p.item.prod._id === prod.item.prod._id) {
                alreadyIn = true;
              }
            });
            if (!alreadyIn) prods.push(prod);
          }
        })
      );
      dispatch({ type: "FindByIds", payload: prods });
    },
    findProdsByString: async (name, parentType) => {
      const string = name.replaceAll(" ", "%20");
      console.log(string);
      let prods = [];
      const productions = [];
      if (parentType === "person") {
        prods = await fetch(
          "https://api.aml-cfwb.be/cql/sru.svc/anon/get?db=scapin.s&format=json&q=(e.np=" +
            string +
            ")" +
            "&sortBy=s.a&resultFields=s.a,t,p.d",
          {
            method: "GET",
headers: {
                Accept: "application/json",
                appName: "CDOctopus",
              },
            mode: "cors",
          }
        ).then(function (response) {
          return response.json();
        });
        prods.map(() => {});
        console.log(prods);
      } else {
        prods = await fetch(
          "https://api.aml-cfwb.be/cql/sru.svc/anon/get?db=scapin.s&format=json&q=(p.d=" +
            string +
            ")" +
            "&sortBy=s.a&resultFields=s.a,t,p.d",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              appName: "CDOctopus",
            },
            mode: "cors",
          }
        ).then(function (response) {
          return response.json();
        });
      }
      await Promise.all(
        prods.map(async (prod) => {
          const prodSchema = {
            prod: {
              _id: prod.ID,
              title: prod.Texte1,

              date: prod.Texte4,
              country: prod.Texte2,
            },
          };
          if (prod.Texte10 && prod.Texte10 !== "" && prod.Texte10 !== "0")
            prodSchema.publishedAt = prod.Texte10;

          const prodFinal = {
            item: prodSchema,
            scapin: true,
          };

          let alreadyIn = false;
          productions.map((p, i) => {
            if (p.item.prod.title === prodFinal.item.prod.title) {
              alreadyIn = true;
              productions[i].item.prod.date += ", " + prodFinal.item.prod.date;
              if (productions[i].item.prod.date.length > 20) {
                productions[i].item.prod.date = productions[
                  i
                ].item.prod.date.substring(0, 9) +  " ..." + productions[i].item.prod.date.substring(productions[i].item.prod.date.length - 10, productions[i].item.prod.date.length );

              }
             }
          });
          if (!alreadyIn) productions.push(prodFinal);
        })
      );
      productions.reverse()
      dispatch({ type: "FindByString", payload: productions });
    },
    findProdRelsById: async (id) => {
      console.log(id)
      const production = await fetch(
        "https://api.aml-cfwb.be/scapin/spectacle.svc/anon/get/" + id,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            appName: "CDOctopus",
          },
          mode: "cors",
        }
      ).then(function (response) {
        return response.json();
      });

      const prod = {
              prod: {
                _id: production[0].ID,
                title: production[0].Titre,
                description: production[0].CommentairesResume,
                duration: production[0].Duree,
                date: production[0].Saison,
                publishedAt: production[0].DatePremiere,
                location: production[0].LieuPremiere,
              },
            };
      const team = await fetch(
        "https://api.aml-cfwb.be/scapin/spectacle.svc/anon/getequipe/" +
          id,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            appName: "CDOctopus",
          },
          mode: "cors",
        }
      ).then(function (response) {
        return response.json();
      });
      const productor = await fetch(
        "https://api.aml-cfwb.be/scapin/spectacle.svc/anon/getproduction/" +
          id,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            appName: "CDOctopus",
          },
          mode: "cors",
        }
      ).then(function (response) {
        return response.json();
      });

      const parents = [];
      productor.map((p) => {
        const parentSchema = {
          _id: p.OrganismeID,
          roles: [
            {
              title: [{ lang: "fr", content: "Producteur" }],
            },
          ],
          scapin: true,
          entity: {
            name: p.DenominationOrganisme,
          },
        };
        parents.push(parentSchema);
      });
      team.map((t) => {
        const parentSchema = {
          _id: t.MembreEquipeID,
          roles: [
            {
              title: [{ lang: "fr", content: t.Fonction }],
              _id: t.FonctionID,
            },
          ],
          scapin: true,
          person: {
            name: t.Prenom + " " + t.Nom,
            isni: t.ISNI,
            birthDate: t.AnneeNaissance,
            deathDate: t.AnneeDeces,
          },
        };
        let duplicate = false;
        parents.map((p, i) => {
          if (p.person && p.person.name === parentSchema.person.name) {
            duplicate = true;
            if (
              p.roles[0].title[0].content !==
              parentSchema.roles[0].title[0].content
            ) {
              p.roles.push(parentSchema.roles[0]);
              parents[i] = p;
            }
          }
        });
        if (!duplicate) {
          parents.push(parentSchema);
        }
      });

      const parentDocs = await apiFetch("/docs/parents/prod/" + prod.prod._id);

      if (parentDocs.data) prod.prod.childs = [...parentDocs.data];
      prod.prod.parents = [...parents];
      
      const prodFinal = {
        item: prod,
        scapin: true,
      };
      dispatch({ type: "FindProdRelsById", payload: prodFinal });
    },
    findEntityByName: async (name) => {
      const entity = await apiFetch("/entities/name", {
        method: "POST",
        body: { name: name },
      });
      dispatch({ type: "FindEntityByName", payload: entity });
    },
    findPersonByName: async (name) => {
      const person = await apiFetch("/people/name", {
        method: "POST",
        body: { name: name },
      });
      dispatch({ type: "FindPersonByName", payload: person });
    },
  };
};

export { useProds };
