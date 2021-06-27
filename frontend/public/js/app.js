(() => {
    const App = {

        htmlElements: {
            taskForm: document.getElementById('task-form'),
            TaskList: document.querySelector('.task-list'),
            formTask: document.querySelector('ul'),
        },
        init: () => {
            App.bindEvents();
            App.initData.users();
        },
        bindEvents: () => {
            App.htmlElements.taskForm.addEventListener('submit', App.events.onTaskFormSubmit);
            App.htmlElements.TaskList.addEventListener('click', App.events.onTasksListClick);
            App.htmlElements.formTask.addEventListener('click', App.events.onTasksListClick);
        },
        initData: {
            users: async () => {
                const { count, data } = await App.utils.getData('http://localhost:4000/api/v1/tasks/');
                let id = 0;
                data.forEach(task => {
                    App.utils.addTask(task, id);
                    id ++;
                });
            },
        },
        events: {
            onTaskFormSubmit: async (event) => {
                event.preventDefault();
                const { 
                    task: { value: taskValue }, 
                    task_option: { value: taskType } 
                } = event.target.elements;
                
                if (event.target.elements.task_submit.innerText === 'Actualizar') {
                    document.getElementById('btn1').setAttribute('class','');
                    App.Variables.update= false;
                    const id = App.Variables.id;
                    await App.utils.updateData('http://localhost:4000/api/v1/tasks/update/'+id, {
                        name: taskValue,
                        type: taskType,
                        completed: false,
                    });
                    App.Variables.id = '';
                    event.target.elements.task_submit.innerText = 'Agregar'

                } else if(event.target.elements.task_submit.innerText === 'Agregar') {
                    await App.utils.postData('http://localhost:4000/api/v1/tasks/', {
                    name: taskValue,
                    type: taskType,
                    completed: false,
                });

                }
                event.target.elements[0].value = '';
                event.target.elements[1].value = '';
                App.utils.reloadTasks();
            },

            onTasksListClick: (event) => {

                const id = event.target.parentNode.getAttribute('id');

                if (event.target.classList.contains('close')) {
                    App.utils.onDelete(event, id);

                } else if(event.target.classList.contains('edit')) {
                    App.Variables.update = true;
                    App.utils.onUpdate(event, id);
                    return;
                } 

                if (App.Variables.update == false){
                    if(event.target.tagName === 'LI'){
                        App.utils.onEventLi(event);
                    }
                }else{
                    document.getElementById('btn1').setAttribute('class','inputAlert');
                }
                
            },
        },
        utils: {
            // Ejemplo implementando el metodo POST:
            postData: async (url = '', data = {}) => {
                // Opciones por defecto estan marcadas con un *
                const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
                });
                return response.json(); // parses JSON response into native JavaScript objects
            },
            getData: async (url = '', data = {}) => {
                // Opciones por defecto estan marcadas con un *
                const response = await fetch(url);
                return response.json(); // parses JSON response into native JavaScript objects
            },
            deletaData: async (url = '', data = {}) => {
                // Opciones por defecto estan marcadas con un *
                const response = await fetch(url, {
                method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
                });
                return response.json(); // parses JSON response into native JavaScript objects
            },
            updateData: async (url = '', data = {}) => {
                // Opciones por defecto estan marcadas con un *
                const response = await fetch(url, {
                    method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify(data) // body data type must match "Content-Type" header
                    });
                return response.json(); // parses JSON response into native JavaScript objects
            },
            addTask: ({name, type, completed}, id) => {

                let taskStatus ;
                
                if (`${completed}` == 'true') {
                    taskStatus = `<LI class="checked" id=`+id+`>
                            <input type="checkbox" class="doTask" value="${completed}" id=`+id+`  checked >
                            <label for="" class="name" style='text-decoration: line-through'id=`+id+`>${name}</label>
                            <label for="" class="type" id=`+id+`>${type}</label>
                            <button class="edit" id=`+id+` disabled></button>
                            <button class="close" id=`+id+`></button>
                            </LI>`;

                } else if (`${completed}` == 'false') {
                    taskStatus = `<LI class="form-task" id=`+id+`>
                            <input type="checkbox" class="doTask" value="${completed}" id=`+id+` >
                            <label for=""class="name" id=`+id+`>${name}</label>
                            <label for="" class="type" id=`+id+`>${type}</label>
                            <button class="edit" id=`+id+` ></button>
                            <button class="close" id=`+id+`></button>
                            </LI>`;
                } 
                App.htmlElements.TaskList.innerHTML += taskStatus;

            },
            onDelete: async (event, id) => {
                const response = await App.utils.deletaData('http://localhost:4000/api/v1/tasks/delete/'+id, {});
                App.utils.reloadTasks();
            },
            onUpdate: async (event, id) => {
                const response = await App.utils.getData('http://localhost:4000/api/v1/task/'+id, {});
                App.htmlElements.taskForm.task.value = `${response.name}`;
                App.htmlElements.taskForm.task_option.value = `${response.type}`;
                App.Variables.id = id;
                App.htmlElements.taskForm.task_submit.innerText = "Actualizar";
                App.utils.disabledButtons(id);
            },
            onDoTask: async (event, id) => {
                const value = (document.getElementsByClassName('doTask')[id].getAttribute('value') == 'true' ) ? 'false' : 'true';
                const taskValue = document.getElementsByClassName('name')[id].innerText;
                const taskType = document.getElementsByClassName('type')[id].innerText;
                const response = await App.utils.updateData('http://localhost:4000/api/v1/tasks/update/'+id, {
                    name: taskValue,
                    type: taskType,
                    completed: value,
                });
                App.utils.reloadTasks();  
            },

            disabledButtons: (id)=>{
                var btns = document.getElementsByClassName('close');
                for (let i = 0; i < btns.length;i++){
                    document.getElementsByClassName('close')[i].setAttribute('disabled','disabled');
                }
                document.getElementsByClassName('close')[id].setAttribute('style','background-color: gray;');
                document.getElementsByClassName('edit')[id].setAttribute('style','background-color: gray;');
            },
            
            onEventLi:(event) =>{
                const id = event.target.getAttribute('id');
                let clase = event.target.getAttribute('class');

                let checkBox = document.getElementsByClassName('doTask')[id];
                
                if(clase === 'form-task'){
                    event.target.classList.remove('form-task')
                    event.target.classList.add('checked')
                    checkBox.checked = true;
                    
                }else if(clase === 'checked'){
                    event.target.classList.remove('checked')
                    event.target.classList.add('form-task')
                    checkBox.checked = false;
                }
                App.utils.onDoTask(event, id);
            },

            reloadTasks: () => {
                App.htmlElements.TaskList.innerHTML = '';
                App.initData.users();
            },

           
        },
        Variables: {
            id: '',
            update: false,
        },
    };
    App.init();
})();
