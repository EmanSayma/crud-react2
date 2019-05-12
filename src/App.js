import axios from 'axios';
import React,{Component} from 'react';
import './App.css';
import loadingGif from './loading.gif';
import ListItem from './ListItem';

class App extends Component {
  constructor(){
    super();
    this.state={
      newTodo:'',
      editing:false,
      editingIndex:null,
      notification:null,
      todos: [],
      loading:true
    };

    this.apiUrl='https://5cd5b7c79c31c600148a9c0b.mockapi.io/';

    this.handleChange= this.handleChange.bind(this);
    this.deleteTodo= this.deleteTodo.bind(this);
    this.editTodo= this.editTodo.bind(this);
    this.updateTodo= this.updateTodo.bind(this);
    this.addTodo= this.addTodo.bind(this);
    this.alert=this.alert.bind(this);
  }



  async componentDidMount(){
    const response = await axios.get(`${this.apiUrl}/todos`);

    setTimeout(()=>{
      this.setState({
        todos:response.data,
        loading: false
      });
    },1000);
    
    
  }

  handleChange(event){
    this.setState({
      newTodo:event.target.value
    })
  }

  

  async addTodo(){
   
    const response = await axios.post(`${this.apiUrl}/todos`,{
       name : this.state.newTodo
    });


    const todos= this.state.todos;
    todos.push(response.data);

    this.setState({
      todos: todos,
      newTodo:''
    })

    this.alert('Todo Added Successfully');
  }

  async deleteTodo(index){
   const todos= this.state.todos;
   const todo = todos[index];

   await axios.delete(`${this.apiUrl}/todos/${todo.id}`);
   delete todos[index];

   this.setState({ todos});

   this.alert('Todo deleted Successfully');
  }

  editTodo(index){
    const todo= this.state.todos[index];
    this.setState({
      editing:true,
      newTodo: todo.name,
      editingIndex: index
    })
  }

  async updateTodo(){
    const todo= this.state.todos[this.state.editingIndex];

    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`,{
      name : this.state.newTodo
    });


    const todos= this.state.todos;

    todos[this.state.editingIndex]= response.data;

    this.setState({
      todos,
      editingIndex: null,
      editing: false,
      newTodo:''
    })

    this.alert('Todo Updated Successfully');

  }

  alert(notification){
    this.setState({
      notification
    })


    setTimeout(()=>{
      this.setState({
        notification:null
      })
    },2000);

  }

  render(){
    return (
      <div className="App">
        <nav className="navbar navbar-light bg-light">
           <span className="navbar-brand mb-0 h1">React CRUD</span>
        </nav> 


        <div className="container mt-5">

        {
          this.state.notification &&
          <div className="alert alert-success mt-3">
            <p className="text-center">{this.state.notification}</p>
           </div>
        }

        

        <input className="form-control my-4" 
        type="text" name="todo"
         placeholder="Add a new todo"
         onChange={this.handleChange}
         value={this.state.newTodo}
        />

        <button 
        onClick={this.state.editing ? this.updateTodo:this.addTodo}
        className="btn-success form-control mb-3"
        disabled={this.state.newTodo.length<5}
        >
          {this.state.editing ? 'Update todo': 'Add todo'}
        </button>
        {
          this.state.loading &&
          <img src={loadingGif} alt=""/>
        }
        {
          (!this.state.editing || this.state.loading ) &&
           <ul className="list-group">
             { this.state.todos.map((item,index)=>{
                  return <ListItem 
                          key= {item.id}
                          item={item}
                          editTodo={()=> {this.editTodo(index);}}
                          deleteTodo={()=> {this.deleteTodo(index);}}
                          />
                   })}        
           </ul>
           }
        </div>   
      </div>
    );
  }
  
}

export default App;
