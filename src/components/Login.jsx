
import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import axios from 'axios';


const initialForm = {
  email: '',
  password: '',
  terms: false,
};


const errorMessages = {
  email: 'Please enter a valid email address',
  password: 'Password must be at least 4 characters long',
  terms: "You must agree to the terms and services",
};


export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({}); //boş array tanımladım.
  const [isValid, setIsValid] = useState(false);

  const history = useHistory();


  //Şimdi bir genel akışı kısaca anlatalım;
  //1. Ekrandan email alanına girilen ilk değeri yakalayan kısım: handleChange
  //2. handleChange bu değişimi "form" tanımı içine yansıtıyor. Tam olarak burada **kod01**
  //3. "form" içindeki değişikleri takip eden bir kısım da: useEffect
  //4. useEffect form değiştiğinde "validateForm" fonksiyonunu çalıştırıyor.
  //5. validateForm fonksiyonu içinde yazan koşullar kontrol ediliyor.


  useEffect(() => {
    validateForm(); // [form] değiştiği anda validateForm fonksiyonu çalışır.
  }, [form]); //nasıl çalışır? : [form] değiştiği anda, yani ekrandan form alanlarına bir değer girildiği anda...

  const validateForm = () => {
    const newErrors = {};

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }

    if (form.password.length < 4) {
      newErrors.password = errorMessages.password;
    }

    if (!form.terms) {
      newErrors.terms = errorMessages.terms;
    }

    if (!validateEmail(form.email)) {
      newErrors.email = errorMessages.email;
    }

    setErrors(newErrors)
    setIsValid(Object.keys(newErrors).length === 0) // hiç hata olmadığı durumu niteler!!!
  };


  const handleChange = (event) => {
    let { name, value, type } = event.target;
    value = type === 'checkbox' ? event.target.checked : value;
    setForm({ ...form, [name]: value }); // **kod01**
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    //şimdi handleSubmit için isValid kontrolünü yazıyoruz. --> if ile;

    if (isValid) {
      axios
        .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
        .then((res) => {
          const user = res.data.find(
            (item) => item.password == form.password && item.email == form.email
          );
          if (user) {
            setForm(initialForm);
            history.push('/main');
          } else {
            history.push('/error');
          }
        });
    } else {
      validateForm();
    }

  };


  return (
    <Form onSubmit={handleSubmit}>

      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          value={form.email}
          invalid={!!errors.email}
        />
        {errors.email && <FormFeedback>{errors.email}</FormFeedback>} {/*hata mesajı varsa hatayı göstermesi için!!*/}
      </FormGroup>

      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password "
          type="password"
          onChange={handleChange}
          value={form.password}
          invalid={!!errors.password}
        />
        {errors.password && <FormFeedback>{errors.password}</FormFeedback>} {/*hata mesajı varsa hatayı göstermesi için!!*/}
      </FormGroup>

      <FormGroup check>
        <Input
          id="terms"
          name="terms"
          checked={form.terms}
          type="checkbox"
          onChange={handleChange}
          invalid={!!errors.terms}
        />{' '}
        <Label htmlFor="terms" check>
          I agree to terms of service and privacy policy
        </Label>
        {errors.terms && <FormFeedback>{errors.terms}</FormFeedback>}  {/*hata mesajı varsa hatayı göstermesi için!!*/}
      </FormGroup>

      <FormGroup className="text-center p-4">
        <Button disabled={!isValid} color="primary">Sign In</Button>
      </FormGroup>

    </Form>
  );
}

