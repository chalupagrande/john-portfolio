import React, { useState, useRef } from 'react'
import {CSSTransition} from 'react-transition-group'
import validator from 'validator'

export default function ContactForm(props) {
  let submitButton = useRef(null)
  let [message, setMessage] = useState('')
  let [isVisible, setIsVisible] = useState(false)
  let [formState, setFormState] = useState({
    name: '',
    email: '',
    comments: ''
  })

  function showForm(){
    setIsVisible(!isVisible)
  }

  function handleChange(e) {
    let id = e.target.id
    let val = e.target.value
    const temp = { ...formState }
    temp[id] = val
    setFormState(temp)
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log(formState)
  }

  function submitForm(e){
    submitButton.current.click(e)
  }

  return (
    <div className="contact">
      <CSSTransition in={isVisible} classNames="spacer-" timeout={300}>
        <div/>
      </CSSTransition>
      {!!message &&
        <p className="contact-message">{message}</p>
      }
        <CSSTransition in={isVisible} classNames="contact-form-transition-state-" timeout={300} appear={isVisible} unmountOnExit={true}>
          <form name="" className='contact-form' onSubmit={handleSubmit}>
            <div className="form-item">
              <label htmlFor="name">Name:</label>
              <input id="name" onChange={handleChange} value={formState.name} required/>
            </div>
            <div className="form-item">
              <label htmlFor="email">Email:</label>
              <input id="email" type="email" onChange={handleChange} value={formState.email} required/>
            </div>
            <div className="form-item">
              <label htmlFor="comments">Comments:</label>
              <textarea id="comments" onChange={handleChange} value={formState.comments}  required/>
            </div>
            <div className="form-item">
              <input className="contact-form__submit"type="submit" ref={submitButton}/>
            </div>
          </form>
        </CSSTransition>
        <button
          className={`contact__button ${isVisible ? "is-submit" : ''}`}
          onClick={!isVisible ? showForm : submitForm}>
            {!isVisible ? 'Contact' : 'Submit' }
          </button>
    </div>
  )
}