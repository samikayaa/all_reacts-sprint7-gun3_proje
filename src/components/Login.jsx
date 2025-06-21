import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import axios from 'axios';


const initialForm = {
  email: '',
  password: '',
  terms: false,
};


export default function Login() {
  const [form, setForm] = useState(initialForm);


  const history = useHistory();


  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    value = type === "checkbox" ? checked : value; //kutucuk işaretli ise value=checked yapar.. değilde value aynı kalır.
    setForm({ ...form, [name]: value });
  };


  const handleSubmit = (event) => {
    event.preventDefault();


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
        />
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
        />
      </FormGroup>

      {/* reactstrap checkbox ekleyelim*/}
      <FormGroup>
        <Input
          id="terms"
          name="terms"
          type="checkbox"
          onChange={handleChange}
          value={form.terms}
        />
        <Label htmlFor="terms">I agree to terms of service and privacy policy</Label>
      </FormGroup>


      <FormGroup className="text-center p-4">
        <Button color="primary" disabled={!form.terms} >Sign In</Button>
      </FormGroup>
    </Form>
  );
}


