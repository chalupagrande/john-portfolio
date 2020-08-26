import React, { useState, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import validator from 'validator'
import axios from 'axios'

export default function ContactForm(props) {
  let submitButton = useRef(null)
  let [uiState, setUiState] = useState({
    messageStatus: 'warn',
    message: '',
    isVisible: false,
    isLoading: false,
  })
  let [formState, setFormState] = useState({
    rName: '',
    rEmail: '',
    rComment: '',
    name: '',
    email: '',
    comments: ''
  })

  function showForm() {
    setUiState({ ...uiState, isVisible: true })
  }

  function handleChange(e) {
    let id = e.target.id
    let val = e.target.value
    const temp = { ...formState }
    temp[id] = val
    setFormState(temp)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    let isSafe = sanitaryAndValid()
    if (isSafe) {
      try {
        setUiState({ ...uiState, isLoading: true })
        const r = await axios({
          method: 'post',
          url: '/api/email',
          data: formState
        })
        setUiState({ ...uiState, message: "Message Sent", messageStatus: 'success', isLoading: false })
      } catch (err) {
        console.error(err)
        setUiState({ ...uiState, message: "Oops. There was an error", messageStatus: 'error', isLoading: false })
      }
    }
  }

  function sanitaryAndValid() {
    // is robot
    if (formState.rName || formState.rEmail || formState.rComment) {
      setUiState({ ...uiState, message: 'Please do not fill out the honeypot. If you are a robot -- shame on you.' })
      return false
    }

    //is human
    let entries = Object.entries(formState)
    let blacklist = `'"/\\|\`<>[]()*{}`
    let isValid = true
    entries.forEach(([key, value]) => {
      let sanitized = validator.escape(value)
      sanitized = validator.blacklist(value, blacklist)
      if (sanitized.length !== value.length) {
        setUiState({ ...uiState, message: "Error. We found some disallowed characters in your inputs." })
        isValid = false
      } else if (key === 'email' && !validator.isEmail(value)) {
        setUiState({ ...uiState, message: "Invalid Email" })
        isValid = false
      } else if (key === 'name' && !validator.isAlphanumeric(value.split(' ').join(''))) {
        setUiState({ ...uiState, message: "Invalid Name" })
        isValid = false
      }
    })
    return isValid
  }

  function submitForm(e) {
    submitButton.current.click(e)
  }

  return (
    <div className="contact">
      <CSSTransition in={uiState.isVisible} classNames="spacer-" timeout={300}>
        <div />
      </CSSTransition>
      {!!uiState.message &&
        <p className={`contact-message ${uiState.messageStatus}`}>{uiState.message}</p>
      }
      <CSSTransition in={uiState.isVisible} classNames="contact-form-transition-state-" timeout={300} appear={uiState.isVisible} unmountOnExit={true}>
        <form name="" className='contact-form' onSubmit={handleSubmit}>
          {/* honeypot */}
          <div className="form__field-shift" aria-label="Please leave the following three fields empty" aria-hidden='true'>
            <div className="form-item">
              <label htmlFor="rName">Honey pot Name:</label>
              <input id="rName" disabled={uiState.messageStatus === 'success'} onChange={handleChange} value={formState.rName} />
            </div>
            <div className="form-item">
              <label htmlFor="rEmail">Honey pot Email:</label>
              <input id="rEmail" disabled={uiState.messageStatus === 'success'} onChange={handleChange} value={formState.rEmail} />
            </div>
            <div className="form-item">
              <label htmlFor="rComments">Honey pot Comments:</label>
              <input id="rComments" disabled={uiState.messageStatus === 'success'} onChange={handleChange} value={formState.rComments} />
            </div>
          </div>
          {/* end honeypot */}
          <div className="form-item">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              onChange={handleChange}
              value={formState.name}
              required
              disabled={uiState.isLoading || uiState.messageStatus === 'success'} />
          </div>
          <div className="form-item">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              onChange={handleChange}
              value={formState.email}
              required
              disabled={uiState.isLoading || uiState.messageStatus === 'success'} />
          </div>
          <div className="form-item">
            <label htmlFor="comments">Comments:</label>
            <textarea
              id="comments"
              onChange={handleChange}
              value={formState.comments}
              required
              disabled={uiState.isLoading || uiState.messageStatus === 'success'} />
          </div>
          <div className="form-item">
            <input
              className="contact-form__submit"
              type="submit" ref={submitButton} />
          </div>
        </form>
      </CSSTransition>
      <button
        className={`contact__button ${uiState.isVisible ? "is-submit" : ''}`}
        disabled={uiState.isLoading || uiState.messageStatus === 'success'}
        onClick={!uiState.isVisible ? showForm : submitForm}>
        {uiState.isLoading ? 'loading' : (!uiState.isVisible ? 'Contact' : 'Submit')}
      </button>
    </div>
  )
}