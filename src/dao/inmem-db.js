//
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.
//
const database = {
    // het array met dummy records. Dit is de 'database'.
    _data: [
        {
            id: 0,
            firstName: 'Hendrik',
            lastName: 'van Dam',
            emailAddress: 'hvd@server.nl',
            isActive: false
            // Hier de overige velden uit het functioneel ontwerp
        },
        {
            id: 1,
            firstName: 'Marieke',
            lastName: 'Jansen',
            emailAddress: 'm@server.nl',
            isActive: true
            // Hier de overige velden uit het functioneel ontwerp
        }
    ],

    // Ieder nieuw item in db krijgt 'autoincrement' index.
    // Je moet die wel zelf toevoegen aan ieder nieuw item.
    _index: 2,
    _delayTime: 500,

    getAll(callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // Roep de callback aan, en retourneer de data
            callback(null, this._data)
        }, this._delayTime)
    },

    getAllActive(callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
        // Filter de data op isActive == true
        const activeUsers = this._data.filter(user => user.isActive);
        // Roep de callback aan, en retourneer de gefilterde data
        callback(null, activeUsers);
        }, this._delayTime)
    },

    getAllInactive(callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
        // Filter de data op isActive == false
        const inactiveUsers = this._data.filter(user => !user.isActive);
        // Roep de callback aan, en retourneer de gefilterde data
        callback(null, inactiveUsers);
        }, this._delayTime)
    },

    getById(id, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            if (id < 0 || id >= this._data.length) {
                callback({ message: `Error: id ${id} does not exist!` }, null)
            } else {
                callback(null, this._data[id])
            }
        }, this._delayTime)
    },

    add(item, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // Voeg een id toe en voeg het item toe aan de database
            item.id = this._index++
            // Voeg item toe aan de array
            this._data.push(item)

            // Roep de callback aan het einde van de operatie
            // met het toegevoegde item als argument, of null als er een fout is opgetreden
            callback(null, item)
        }, this._delayTime)
    },

    updateUser(id, updatedUser, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // Zoek de index van de gebruiker met de opgegeven ID in de _data-array
            const index = this._data.findIndex(user => user.id === parseInt(id));
            console.log(index)
            // Controleer of de gebruiker met de opgegeven ID is gevonden
            if (index === -1) {
                // Als de gebruiker niet is gevonden, retourneer een foutbericht via de callback
                callback({ message: `Error: User with id ${id} not found!` }, null);
            } else {
                // Als de gebruiker is gevonden, bijwerk de gebruiker met de nieuwe gegevens
                this._data[index] = { ...this._data[index], ...updatedUser };

                // Retourneer de bijgewerkte gebruiker via de callback
                callback(null, this._data[index]);
            }
        }, this._delayTime);
    }
    
    // Voeg zelf de overige database functionaliteit toe
}

module.exports = database
// module.exports = database.index;
