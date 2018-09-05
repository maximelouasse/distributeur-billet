/*
VARIABLES
*/
    const montantBillet = [100, 50, 20, 10, 5];
    const montantsButton = document.getElementById('montants');
    
    let compteUser = undefined;
    let erreurCode = 0;
    let btnInsertCard = document.getElementById("btnInsertCard");
    let formPin = document.getElementById("formPin");
    let menu = document.getElementById("menu");
    let retirerBtn = document.getElementById("retirerBtn");
    let retirer = document.getElementById("retirer");
    let gifSwallowCard = document.getElementById('swallow-card');
    let resultBillet = document.getElementById('billet');
    
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

    let stockageBillet = [
        {
            "valeurBillet": 5,
            "nombre": 100
        },
        {
            "valeurBillet": 10,
            "nombre": 50
        },
        {
            "valeurBillet": 20,
            "nombre": 40
        },
        {
            "valeurBillet": 50,
            "nombre": 30
        },
        {
            "valeurBillet": 100,
            "nombre": 10
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
        for(let i = montantBillet.length - 1; i >= 0; i--)
        {
            montantsButton.innerHTML += `<button type="button" class="montant" value="${montantBillet[i]}">${montantBillet[i]}€</button>`;
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

    const calculBillet = (montant) => {
        let quantite = 0;
        let result = [];
        for(let i = 0; i < montantBillet.length; i++)
        {
            if(montantBillet[i] <= montant)
            {
                quantite = montant / montantBillet[i];
                if(quantite >= 1)
                {
                    quantite = Math.trunc(quantite);
                }

                if(quantite % 1 === 0)
                {
                    montant = montant % montantBillet[i];
                    result.push({"quantite": quantite, "montantBillet": montantBillet[i]});
                }
            }
        }

        return result;
    }
//


// Function Click Insert Card
btnInsertCard.addEventListener('click', () => {
    formPin.style.display = "block";
    btnInsertCard.style.display = "none";
});

formPin.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputPin = document.getElementById("password");
    let user = inputPin.value;

    if(user != "")
    {
        let promise = Promise.resolve(getUser(user));
        promise.then(function(value)
        {
            compteUser = value;
            
            if(compteUser != undefined)
            {
                menu.style.display = "block";
                formPin.style.display = "none";

                retirerBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    retirer.style.display = "block";
                    menu.style.display = "none";

                    displayMontants();

                    //event
                    let arrayMontantsButton = document.querySelectorAll('.montant');
                    
                    for(let i = 0; i < arrayMontantsButton.length; i++)
                    {
                        arrayMontantsButton[i].addEventListener('click', () => {
                            let solde = undefined;
                            let montant = 0;
                            let billets;
                            
                            if(arrayMontantsButton[i].value == 0)
                            {
                                montant = prompt("Saisir un montant : ");

                                if(montant != "")
                                {
                                    solde = checkSolde(montant);
                                    billets = calculBillet(montant);
                                }
                            }
                            else
                            {
                                solde = checkSolde(arrayMontantsButton[i].value);
                                billets = calculBillet(arrayMontantsButton[i].value);
                            }

                            if(solde != false)
                            {   
                                if(confirm("Voulez-vous un ticket de reçu ?"))
                                {
                                    setTimeout(function() {
                                        resultBillet.innerHTML = '<img src="./img/giphy4.gif" alt="" width="75%" height="75%">';
                                        resultBillet.innerHTML += '<p>Votre ticket, pas de quoi être fier de vous !</p>';
                                    }, 4000);
                                }

                                resultBillet.innerHTML = '<img src="./img/giphy.gif" alt="" width="70%" height="70%">';
                                resultBillet.innerHTML += `<p> Vous retirez: <ul>`;

                                for(let billet in billets)
                                {
                                    resultBillet.innerHTML += `<li>${billets[billet].quantite} billet(s) de ${billets[billet].montantBillet}€</li>`;
                                }

                                resultBillet.innerHTML += `</ul></p>`;
                                resultBillet.innerHTML += `<p>Votre nouveau solde est de ${compteUser.solde} € !</p>`;
                            }
                            else
                            {
                                resultBillet.innerHTML += '<img src="./img/giphy3.gif" alt="" width="75%" height="75%">';
                                resultBillet.innerHTML += `<p>Tu ne possèdes pas le montant ${montant}€, tu es trop pauvre !</p>`
                            }

                            montantsButton.style.display = "none";
                            resultBillet.style.display = "block";
                        });
                    }
                });
            }
            else
            {
                erreurCode++;

                if(erreurCode === 3)
                {
                    formPin.style.display = "none";
                    gifSwallowCard.style.display = "block";
                }
                else
                {
                    alert(`Votre code est erronné, il vous reste ${3 - erreurCode} chance(s)`);
                    inputPin.value = "";
                }
            }
        });
    }
});
//