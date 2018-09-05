const montants = [20, 30, 40, 50, 60, 80, 100];
const montantsButton = document.getElementById('montants');
let compteUser = undefined;

const getAllComptes = async () => {
    const apiResult = await fetch(`./distriBillet.json`);
    const jsonResult = await apiResult.json();
    return jsonResult.comptes;
}

const getUser = async (code_cb) => {
    const comptes = await getAllComptes();
    for(var compte in comptes)
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
            alert('ok');
        }
        else
        {
            alert('pas ok');
        }
    }
}

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
                        if(montantsButton[i].value == 0)
                        {
                            let montant = prompt("Saisir un montant : ");

                            if(montant != "")
                            {
                                checkSolde(montant);
                            }
                        }
                        else
                        {
                            checkSolde(montantsButton[i].value);
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