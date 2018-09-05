/*
VARIABLES
*/
    const montants = [20, 30, 40, 50, 60, 80, 100];
    const montantsButton = document.getElementById('montants');
    let compteUser = undefined;
    let jsonComptesUser = [
            {
                "id_compte": 111111,
                "nom": "Venet",
                "prenom": "Alexandre",
                "solde": 1000,
                "num_carte": 23658412548965742,
                "code_cb": 1234
            },
            {
                "id_compte": 222222,
                "nom": "Louasse",
                "prenom": "Maxime",
                "solde": 20000,
                "num_carte": 462514583965214587,
                "code_cb": 2233
            },
            {
                "id_compte": 333333,
                "nom": "Houvin",
                "prenom": "Corentin",
                "solde": 1,
                "num_carte": 45874125456325412,
                "code_cb": 4321
            }
    ];
//

/*
METHODES*/
    const getAllComptes = async () => {
        const apiResult = await fetch(`./distriBillet.json`);
        const jsonResult = await apiResult.json();
        return jsonResult.comptes;
    }

    const getUser = async (code_cb) => {
        const comptes = await getAllComptes();
        for(var compte in jsonComptesUser)
        {
            if(code_cb == comptes[compte].code_cb)
            {
                return comptes[compte];
            }
        }
    }

    const displayMontants = () => {
        for(let i = 0; i < montants.length; i++)
        {
            montantsButton.innerHTML += `<button type="button" class="montant" value="${montants[i]}">${montants[i]}€</button>`;
        }
        montantsButton.innerHTML += `<button type="button" class="montant" value="0">Choisir le montant</button>`;
    }

    const checkSolde = (montant) => {
        if(compteUser != undefined)
        {
            if(compteUser.solde >= montant)
            {
                compteUser.solde = compteUser.solde - montant;
            }
            else
            {
                return false;
            }
        }
    }
//

/*
Lancer l'application une fois la page chargée
*/
window.addEventListener( 'load', async () => {
    // Charger le contenu de la page
    let user = prompt("Saisir votre code : ");
    
    if(user != "")
    {
        let promise = Promise.resolve(getUser(user));
        promise.then(function(value)
        {
            compteUser = value;

            if(compteUser != undefined)
            {
                displayMontants();

                //event
                let montantsButton = document.querySelectorAll('.montant');
                
                
                for(let i = 0; i < montantsButton.length; i++)
                {
                    montantsButton[i].addEventListener('click', () => {
                        let solde = undefined;
                        let montant = 0;
                        if(montantsButton[i].value == 0)
                        {
                            montant = prompt("Saisir un montant : ");

                            if(montant != "")
                            {
                                solde = checkSolde(montant);
                            }
                        }
                        else
                        {
                            solde = checkSolde(montantsButton[i].value);
                        }

                        if(solde != false)
                        {
                            console.log(`Votre compte a un solde de ${compteUser.solde}€`);
                            
                            if(confirm("Voulez-vous un ticket de reçu ?"))
                            {
                                console.log("Et la nature vous y avez pensé ?");
                            }
                            else
                            {
                                console.log("C'est bien vous pensez à la nature :) ");
                            }
                        }
                        else
                        {
                            console.log(`Le solde de votre comtpte n'est pas suffisant pour retirer ${montant}€`);
                        }
                    });
                }
            }
            else
            {
                console.log('pas de compte');
            }
        });
    }
});
//