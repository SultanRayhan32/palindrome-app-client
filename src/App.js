import React , { Component } from 'react';
import axios from 'axios'
import swal from 'sweetalert'


import "./style/index.css"

class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      palidromeWord : "",
      isPalindrome : null,
      palindromeList : []
    }
  }

  checkPalindrome = (kata) => {
    let temp = ""
    for(let i =  kata.length -1; i >=0; i--) {
      temp += kata[i]
    }
    this.setState({
      palidromeWord : temp
    })
  }

  deletePalindrome = (id) => {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      closeOnClickOutside : true,
      confirmButtonColor: 'pink',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showCloseButton : true
    }).then((result) => {
      if (result) {
        axios.delete(`http://34.87.55.37/palindrome/${id}`)
        .then(({data})=>{
          this.fetchData()
        })
        .catch(console.log)
      }
    })
  }


  addPalindrom = () => {
    this.loading(2000)
    let kata = this.refs.kata.value
    this.checkPalindrome(kata)
    if(kata.length <= 2) {
      swal({
        title :'Wrong Input',
        text :'Kata yand and Masukkan Terlalu Sedikit',
        icon :'warning'
      }
    )
    }else {
      axios.post("http://34.87.55.37/palindrome",{
        word : kata
      })
      .then(({data})=>{
        if(data.response){
          swal({
              title :'Success add Data',
              text :'Your word is palindrome',
              icon :'success'
            }
          )
          this.fetchData()
          this.setState({
            isPalindrome : "Is Palindrome"
          })
        }else {
          
          swal({
            title :'Wrong Input',
            text :'Your word is not palindrome',
            icon :'warning'
          }
        )
          this.setState({
            isPalindrome : "Is Not Palindrome"
          })
        }
      })
      .catch(console.log)
    }
  }

  fetchPalindrome = () =>{
    return this.state.palindromeList.map(data=>{
      return(
        <tr key={data._id}>
          <td>{data.Word}</td>
          <td><img className="delete-logo" onClick={()=>this.deletePalindrome(data._id)} alt="deletelogo" src="https://image.flaticon.com/icons/png/512/61/61848.png"/></td>
        </tr>
      )
    })
  }
  
  fetchData = () => {
    this.loading(1000)
    axios.get("http://34.87.55.37/palindrome")
    .then(({ data })=>{
      console.log(data , " <<<<<<<<<<<<<<<<<")
      this.setState({
        palindromeList : data
      })
    })
    .catch(console.log)
  }

  loading = (time) => {
    let timerInterval
    swal({
      title: 'Loading..',
      timer: time || 2000,
      onBeforeOpen: () => {
        swal.showLoading()
        timerInterval = setInterval(() => {
          swal.getContent().querySelector('strong')
            .textContent = this.$swal.getTimerLeft()
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      if (
        /* Read more about handling dismissals below */
        result === swal.timer
      ) {
      }
    })
  }

  componentDidMount () {
    this.fetchData()
  }

  render ( ) {
    return (
      <div className="container-app">
        <p className="text-logo">Welcome In Palindrom App</p>
        <input placeholder="enter your word here" type="text" className="input-text" ref="kata" />
        <button className="button-app" onClick={()=>  this.addPalindrom()}>Enter</button>
        <div className="text-output">
          {this.state.palidromeWord}
        </div>
        <div>
          {
            this.state.isPalindrome ? <p className="text-output2">{this.state.isPalindrome}</p> :<></>
          }
        </div>
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              this.fetchPalindrome()
            }
          </tbody>
        </table>
      </div>
    );
  }
}


export default App;
