import { useState } from 'react'

export default function useForm() {

  const [formContent, setFormContent] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    type: '1',
    howToKnow: '',
    other: ''
  })

  const handleInputChange = (e) => {
    const { target } = e
    const { name, value} = target
    setFormContent({
      ...formContent,
      [name]: value
    })
  }

  const handleSubmit = () => {
    const checkFormat = { 
      success: true,
      errorMessage: [],
      notNull: function(obj, msg) {
        if (!obj) {
          this.success = false
          this.errorMessage.push(msg)
        }
        return this
      },
      validEmail: function(obj, msg) {
        const  regex = /^[\w\.\-\+]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/
        if (!regex.test(obj)) {
          this.success = false
          this.errorMessage.push(msg)          
        }
        return this     
      },
      notEmptyObject: function(obj, msg) {
        const attributes = Object.values(obj)
        if (attributes.every(attr => !attr)) {
          this.success = false
          this.errorMessage.push(msg)          
        }
        return this 
      },
    }
    const result = checkFormat
      .notNull(formContent.username, '姓名不得為空')
      .notNull(formContent.email, '電子郵件不得為空')
      .validEmail(formContent.email, '電子郵件格式不符')
      .notNull(formContent.phoneNumber, '手機號碼不得為空')
      .notEmptyObject(formContent.type, '報名類型不得為空')
      .notNull(formContent.howToKnow, '如何得知活動資訊不得為空')
    if (!result.success) {
      alert(result.errorMessage.join('\r\n'))
      return
    }
    alert(formContent.username)
    alert(formContent.type)
    alert('我們已收到您的報名資訊')
  }

  return [formContent, handleInputChange, handleSubmit]
}


