class Todo {
    /**
     * Todo konstruktorius
     */
    constructor() {
        this.storageList = 'tasks21.list';
        this.storageID = 'tasks21.lastID';

        this.formDOM = null;
        this.taskInputDOM = null;
        this.deadlineInputDOM = null;
        this.colorInputDOM = null;
        this.submitDOM = null;
        this.listDOM = null;

        this.tasks = [];
        this.lastID = 0;
    }

    init() {
        this.formDOM = document.querySelector('form');
        this.taskInputDOM = document.getElementById('task');
        this.deadlineInputDOM = document.getElementById('deadline');
        this.colorInputDOM = document.getElementById('border');
        this.submitDOM = this.formDOM.querySelector('button');
        this.listDOM = document.querySelector('.list');

        this.addActions();

        // bandymas is localStora (atminties) irstraukti seniau irasytus duomenis
        const oldID = localStorage.getItem(this.storageID);
        const oldList = localStorage.getItem(this.storageList);

        try {
            const parsedOldList = JSON.parse(oldList);

            if (parsedOldList) {
                this.tasks = parsedOldList;
            }
        } catch (error) {
            console.log(error);
        }

        try {
            const parsedOldID = JSON.parse(oldID);

            if (parsedOldID) {
                this.lastID = parsedOldID;
            }
        } catch (error) {
            console.log(error);
            this.lastID = this.tasks.length;
        }

        this.read();
    }

    addActions() {
        this.submitDOM.addEventListener('click', e => {
            e.preventDefault();

            const task = this.taskInputDOM.value;
            const deadline = this.deadlineInputDOM.value;
            const color = this.colorInputDOM.value;
            this.create(task, deadline, color);
        })
    }

    /**
     * Metodas naujos uzduoties sukurimui
     * @param {string} text Uzduoties aprasymas, ka reikes daryti
     * @param {string} deadline Data iki kada atlikti uzduoti; formatas _`yyyy-mm-dd`_
     * @param {string} borderColor Korteles, atvaizduojancios uzduoti, krastines spalva
     */
    create(text, deadline, borderColor) {
        this.tasks.push({
            id: ++this.lastID,
            text,
            deadline,
            borderColor
        });

        localStorage.setItem(this.storageID, JSON.stringify(this.lastID));
        localStorage.setItem(this.storageList, JSON.stringify(this.tasks));

        this.read();
    }

    /**
     * Atvaizduoti visas uzduotis
     */
    read() {
        let HTML = '';
        for (const task of this.tasks) {
            HTML += `<div class="item" style="border-color: ${task.borderColor};" data-id="${task.id}">
                        <div class="actions">
                            <div class="edit">Edit</div>
                            <div class="delete">Delete</div>
                        </div>
                        <p>${task.text}</p>
                    </div>`;
        }

        this.listDOM.innerHTML = HTML;

        const items = this.listDOM.querySelectorAll('.item');
        for (const item of items) {
            const id = +item.dataset.id;
            const deleteButton = item.querySelector('.delete');

            deleteButton.addEventListener('click', () => this.delete(id, item));
        }
    }

    /**
     * Atnaujinti vienos konkrecios uzduoties informacija
     */
    update(id) {

    }

    /**
     * Istrinti viena konkrecia uzduoti
     */
    delete(id, item) {
        this.tasks = this.tasks.filter(task => task.id !== id);

        localStorage.setItem(this.storageList, JSON.stringify(this.tasks));
        item.remove();
    }
}

export { Todo }