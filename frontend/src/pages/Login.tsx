import { Button, Checkbox, Group, PasswordInput, Container, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router';
import type { LoginFormValues } from '../interfaces/AuthInterface';


function Login({ setAuthenticated }: { setAuthenticated: (auth: boolean) => void }) {
  const [visible, { toggle }] = useDisclosure(false); 
  const location = useLocation();


  const form = useForm<LoginFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      termsOfService: false,
    }
  });

  const submitForm = (values: LoginFormValues) => {
    
    console.log(values);

    let { username, password, termsOfService } = values;

    if (!termsOfService) {
      alert("You must agree to the terms of service to log in.");
      return;
    }

 
    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })  .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        setAuthenticated(true);
        localStorage.setItem('token', data.token);
        location.pathname === '/login' ? window.location.href = '/dashboard' : window.location.reload();
    }
    ).catch(error => {
        console.error('Error during login:', error);
        alert('Login failed: ' + error.message);
    });
  }

  return (
    <Container>
    <Title order={1}>Login</Title>
    <form onSubmit={form.onSubmit(values => submitForm(values))}>
      <TextInput
        withAsterisk
        label="Username"
        placeholder="Your Username"
        key={form.key('username')}
        {...form.getInputProps('username')}
      />

       <PasswordInput
        withAsterisk
        label="Password"
        placeholder='Your Password'
        key={form.key('password')}
        {...form.getInputProps('password')}
        visible={visible}
        onVisibilityChange={toggle}
      />

      <Checkbox
        mt="md"
        label="I agree to participate in this research study"
        key={form.key('termsOfService')}
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
    <Link to="/register">Don't have an account? Register</Link>
    </Container>
  );
}

export default Login;