// Storage Controller


// Item Controller
const itemCtrl = (function(){
  const item = function(id,meal,calories){
    this.id = id;
    this.meal = meal;
    this.calories = calories;
  }

  // Data structure/state
  const data = {
    items:[
      // {id:0,meal:'Rice',calories:300},
      // {id:1,meal:'Beans',calories:600},
      // {id:2,meal:'Fish',calories:700},
    ],
    currentItem:null,
    totalCalories:0
  }

  
  // public method
  return{
    getInputValues:function(meal,calories){
      let Id;
      if(data.items.length > 0){
        Id = data.items[data.items.length - 1].id+1;
      }else{
        Id = 0
      }
      // parse calories
      calories = parseInt(calories);
      // initiate new item
      getInputItem = new item(Id,meal,calories);
      // push getInputItem
      data.items.push(getInputItem);
      // return getInputItem
      return getInputItem;
    },
    getDeleteId:function(id){
      // get ids
      const ids = data.items.map(function(item){
        return item.id;
      });
      // get the index
      const index = ids.indexOf(id);
      // deleting by index
      data.items.splice(index,1);
    },
    getitemEdit:function(currId){
      let itemId = null;
      data.items.forEach(function(item){
        if(item.id === currId){
          itemId = item;
        }
      });
      return itemId;
    },
    updateNewInput:function(meal,calories){
      // parse calories
      calories = parseInt(calories);
      let itemId = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          itemId = item;
        }
      });
      return itemId;
    },
    setNewItemId:function(item){
      data.currentItem = item;
    },
    getCalories:function(){
      let total = 0;
      data.items.forEach(function(item){
        total+= item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    returnNewItemId:function(){
      return data.currentItem;
    },
    getItems:function(){
      return data.items
    },
    logInfo:function(){
      return data
    }
  }
})();

// UI Controller
const UICtrl = (function(){
  const UISelectors ={
    uiList: '#item-list',
    listValue: '#item-list li',
    addBtn: '#add-btn',
    updateBtn: '#update-btn',
    deleteBtn: '#delete-btn',
    backBtn: '#back-btn',
    mealInputs:'#text-meal',
    caloriesInputs:'#text-calories',
    totalCalories:'#total-calories'
  }
  
  // public method
  return{
    setItems:function(items){
      let html = '';
      items.forEach(function(item){
        html+= `
        <li class="list-group-item" id="item-${item.id}">
          <strong>${item.meal}: </strong><em>${item.calories} Calories</em>
          <a href="#" style='float:right;'><i class="edit-item fa fa-pencil-alt"></i></a>
        </li>
        `;
      });
      document.querySelector(UISelectors.uiList).innerHTML= html;
    },
    setInputItem:function(item){
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
      <strong>${item.meal}: </strong><em>${item.calories} Calories</em>
          <a href="#" style='float:right;'><i class="edit-item fa fa-pencil-alt"></i></a>
      `;
      document.querySelector(UISelectors.uiList).insertAdjacentElement('beforeend',li);
    },
    setUpdateItems:function(item){
      let listGroups = document.querySelectorAll(UISelectors.listValue);

      listGroups = Array.from(listGroups);

      listGroups.forEach(function(listGroup){
        const itemsList = listGroup.getAttribute('id');
        if(itemsList === `item-${item.id}`){
          document.querySelector(`#${itemsList}`).innerHTML= `<strong>${item.meal}: </strong><em>${item.calories} Calories</em>
          <a href="#" style='float:right;'><i class="edit-item fa fa-pencil-alt"></i></a>`;
        }
      });
    },
    setDeleteId:function(id){
      const deleteId = `#item-${id}`;
      const deleteItem = document.querySelector(deleteId);
      deleteItem.remove();
    },
    setItemNewId:function(){
    document.querySelector(UISelectors.mealInputs).value = itemCtrl.returnNewItemId().meal,
    document.querySelector(UISelectors.caloriesInputs).value = itemCtrl.returnNewItemId().calories
    },
    getInputs:function(){
      return{
        meal:document.querySelector(UISelectors.mealInputs).value,
        calories:document.querySelector(UISelectors.caloriesInputs).value
      }
    },
    setCalories:function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearInputs(){
      document.querySelector(UISelectors.mealInputs).value ='',
      document.querySelector(UISelectors.caloriesInputs).value=''
    },
    staticState(){
      document.querySelector(UISelectors.addBtn).style.display='none';
      document.querySelector(UISelectors.updateBtn).style.display='inline';
      document.querySelector(UISelectors.deleteBtn).style.display='inline';
      document.querySelector(UISelectors.backBtn).style.display='inline';
    },
    currentState(){
      UICtrl.clearInputs();
      document.querySelector(UISelectors.addBtn).style.display='inline';
      document.querySelector(UISelectors.updateBtn).style.display='none';
      document.querySelector(UISelectors.deleteBtn).style.display='none';
      document.querySelector(UISelectors.backBtn).style.display='none';
    },
    getUISelectors:function(){
      return UISelectors;
    }
    
  }
})();


// App Controller
const appCtrl = (function(itemCtrl,UICtrl){
  // Event loaders
  const eventLoaders = function(){
    //get ui selectors
    const UISelectors = UICtrl.getUISelectors();
    // Disable Keypress on Enter
    document.addEventListener('keypress',function(e){
      if(e.keyCode === 12 || e.which ===13){
        e.preventDefault();
        return false;
      }
    })
    // Add Event listener
    document.querySelector(UISelectors.addBtn).addEventListener('click', AddItem);
    // Edit Event listener
    document.querySelector(UISelectors.uiList).addEventListener('click', EditItem);
    // Update Event listener
    document.querySelector(UISelectors.updateBtn).addEventListener('click', UpdateItem);
    // Delete Event listener
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', DeleteItem);
    // Back Event listener
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.currentState);
  }
  
// Add Item
const AddItem = function(e){
  e.preventDefault();
  
  // get inputs from UI ctrl
  const input = UICtrl.getInputs();
    if(input.meal !== '' && input.calories !== ''){
      // get input item from item ctrl
      const getInputItem = itemCtrl.getInputValues(input.meal,input.calories)
      // set input item to ui ctrl
      UICtrl.setInputItem(getInputItem);

      // get calories
      const totalCalories = itemCtrl.getCalories();
      // set calories
      UICtrl.setCalories(totalCalories);
      //clear inputs
      UICtrl.clearInputs();
    }
}

// Edit List Items
const EditItem = function(e){
  e.preventDefault();
  if(e.target.classList.contains('edit-item')){
    const listItem = e.target.parentNode.parentNode.id;
    const itemId = listItem.split('-');
    currId = parseInt(itemId[1]);
    // get item by id
    const getEditItem = itemCtrl.getitemEdit(currId);
    // set item by id in itemCtrl
    const setItemId = itemCtrl.setNewItemId(getEditItem)
     // set item by id to Ui
     UICtrl.setItemNewId()
    // Edit state buttons
     UICtrl.staticState()
  }
}

// Update Item
const UpdateItem = function(e){
  e.preventDefault()
  
  // get inputs values
  const newInput = UICtrl.getInputs();
  // update inputs value
  const updateItems = itemCtrl.updateNewInput(newInput.meal,newInput.calories);
  // set update inputs value
  UICtrl.setUpdateItems(updateItems);
  // get calories
  const totalCalories = itemCtrl.getCalories();
  // set calories
  UICtrl.setCalories(totalCalories);
  UICtrl.currentState();

}

// Delete items
const  DeleteItem = function(e){
  e.preventDefault();
  // get current items to delete
  const deleteItems = itemCtrl.returnNewItemId();
  // get item to delete
  itemCtrl.getDeleteId(deleteItems.id);
  
  // set item to delete
  UICtrl.setDeleteId(deleteItems.id);

  // get calories
  const totalCalories = itemCtrl.getCalories();
  // set calories
  UICtrl.setCalories(totalCalories);
  UICtrl.currentState();
}

  // public method
  return{
    init:function(){
      // instantiate current state
      UICtrl.currentState()
      // get item from item controler
      const items = itemCtrl.getItems();
      // Set item to UI controller
      UICtrl.setItems(items);
      
      // Event loaders
      eventLoaders();
      
    }
  }
})(itemCtrl,UICtrl);
appCtrl.init();