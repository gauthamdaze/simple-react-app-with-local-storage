import React from 'react'
import {DelayInput} from 'react-delay-input';
require('./searchable_select_box_style.css');


export default class SearchableSelectBox extends React.Component {

constructor(){
	super();
	this.options = [];
    this.state ={
      selectClass:"hide"
    }

    this.keys = [];
    this.values = [];

  this.cln="";

  this.isFilterSearchCalled = false;
  this.filterText = "";

  this.isSearchBoxFocused = false;


}

componentWillMount(){
	
this.options = [];
this.isFilterSearchCalled = false;
this.filterText = "";

this.keys = JSON.parse(JSON.stringify(this.props.keys));
this.values = JSON.parse(JSON.stringify(this.props.values));

for(let i=0;i<this.props.keys.length;i++){

	this.options.push(
    <li  key={i} onClick={this.changeValue.bind(this,this.keys[i])} >{this.values[i]}</li>
		);
  }

   
}//componentWillMount 

componentWillReceiveProps(nextProps) {
  this.options = [];
  this.isFilterSearchCalled = false;
  this.filterText = "";

  this.keys = JSON.parse(JSON.stringify(nextProps.keys));
  this.values = JSON.parse(JSON.stringify(nextProps.values));

  for(let i=0;i<nextProps.keys.length;i++) {

     this.options.push(
        <li  key={i} onClick={this.changeValue.bind(this, this.keys[i])} > {this.values[i]}</li>
     );
   }

}



componentDidUpdate(prevProps, prevState) {
     if(this.state.selectClass=="searchable-select-box-container"){ 
        //focus the input text
        this.searchBoxFocused();
         if(this.props.top ) {

              if(this.props.top!=0 ) { 

                   //remove the already present
                  if(this.cln != ""){
                       //document.body.removeChild(this.cln);
                       $(this.cln).remove();
                       this.cln="";        
                  }


                   this.cln = this.refs.dropDown.cloneNode(true);
                   let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                   this.cln.style.position='absolute';
                   this.cln.style.display='block';
                   this.cln.style.width = this.props.width + "px";
                   this.cln.style.top= this.props.top  + "px";
                   this.cln.style.left= this.props.left  + "px";
                   if(this.props.fontSize){
                    this.cln.style.fontSize = this.props.fontSize+"px";
                   }
                   document.body.appendChild(this.cln);
                   /***********check weather current display height is greater than viewport height or  not*****/
                   let elementHeight = parseFloat(window.getComputedStyle(this.cln).height);
                   let displayBottomCoordinate = this.props.top + elementHeight;
                   let browserBottomCoordinate = window.innerHeight + window.scrollY;
                   if( displayBottomCoordinate > browserBottomCoordinate){
                    //top 
                    this.cln.style.top= (this.props.top - elementHeight) + "px";
                    this.cln.style.borderTop = "1px solid #ddd";
                 }
                
                  

                    

                 //put a  onchane listener listener on input type = text and focus it
                 
                 this.cln.childNodes[0].value = this.filterText;
                 this.cln.childNodes[0].addEventListener("input",this.filterSearch.bind(this),false);
                 this.cln.childNodes[0].addEventListener("focus",this.searchBoxFocused.bind(this),false);
                 this.cln.childNodes[0].addEventListener("blur",this.searchBoxLoosedFocused.bind(this),false);
                 this.cln.childNodes[0].addEventListener("click",this.searchBoxClicked.bind(this),false);
                 

                 //put the onclick listener on all the dropdown options

                 for(let i=0;i<this.cln.childNodes[1].childNodes.length;i++){
                                
                    this.cln.childNodes[1].childNodes[i].addEventListener("click",this.changeValue.bind(this,this.keys[i]) );
                       
                  }//for 
        
              
                  //focus the appropriate listener
                  if (!this.isSearchBoxFocused){
                    this.cln.addEventListener("blur",this.hideSelectBox.bind(this),false);
                    this.cln.focus();
                  } else {
                    this.cln.childNodes[0].focus()

                  }  
              }


         }     
      }else{
        if(this.cln != ""){
                 $(this.cln).remove();
                 this.cln="";        
        }  
      }   
    }//componentDidUpdate


/*componentDidUpdate(prevProps, prevState) {


   if(this.state.selectClass=="searchable-select-box-container"){
  
      this.refs.inputText.focus();
  
   }
}*/

changeValue(newVal,e) {  
  e.stopPropagation();  
  this.props.methodToCall(newVal);
}
 
searchBoxClicked(e){
  e.stopPropagation();
}  

searchBoxFocused(e) {

  
  this.isSearchBoxFocused = true;
}

searchBoxLoosedFocused(e){
  e.stopPropagation();
  if(!this.isFilterSearchCalled) {
    this.isSearchBoxFocused = false;
    this.hideSelectBox();
  }else {
    this.isFilterSearchCalled = false;
  }
  

}

hideSelectBox() {

 setTimeout(function() {

  if(!this.isFilterSearchCalled && !this.isSearchBoxFocused) {
    this.props.hideSelectBox();
  } else {
    this.isFilterSearchCalled = false;
  }  
 }.bind(this),200); 

}


closeEllipsisText(e) {
  clearEllipsisText(e);
} 


filterSearch(e){
  this.isFilterSearchCalled = true;
  this.filterText = e.target.value; 
  var searchText = e.target.value.toLowerCase();
  if(searchText != ""){
      
        this.keys = [];
        this.values = [];   

        this.options = [];

        for(let i=0;i<this.props.keys.length;i++){
              
            if(this.props.values[i].toLowerCase().indexOf(searchText) != -1){
               this.options.push(
                <li  key={i} onClick={this.changeValue.bind(this,this.props.keys[i])} >{this.props.values[i]}</li>
               );

               this.keys.push(this.props.keys[i]);
               this.values.push(this.props.values[i]);

           } 
        }  
  }else{
       this.options = [];
       this.keys = [];
       this.values = []; 

       for(let i=0;i<this.props.keys.length;i++){

              this.options.push(
               <li  key={i} onClick={this.changeValue.bind(this,this.props.keys[i])} > {this.props.values[i]}</li>
              );
              this.keys.push(this.props.keys[i]);
              this.values.push(this.props.values[i]);
       }
  }

  
 this.forceUpdate();   
}//filterSearch


render(){

this.state.selectClass = this.props.isToShowSelectBox ? "searchable-select-box-container" : "hide";
var listStyle = {};
    if(this.props.top ){

              if(this.props.top!=0 ){
                  listStyle['display'] = 'none';
              }
    }    


return(

<div className={this.state.selectClass} ref="dropDown" tabIndex="0" onClick={(e)=>{e.stopPropagation()}} style={listStyle}>

<DelayInput
style ={{'minWidth': '0px',
}}
           inputRef={ref => {
            this.refs = ref;
          }}
          minLength={0}
          delayTimeout={1000}
          onKeyUp={this.filterSearch.bind(this)}
          onBlur={this.hideSelectBox.bind(this)} />
 

 <ul className="website-select-style">

  {this.options}

 </ul>
 
</div>

);


}//render

}//selectBox

