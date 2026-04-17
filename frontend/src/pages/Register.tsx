import { Button, Checkbox, Group, PasswordInput, Container, TextInput, Title, Select, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { Link } from 'react-router';
import type { RegisterFormValues } from '../interfaces/AuthInterface';

function Register() {
  const [visible, { toggle }] = useDisclosure(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      neuro: false,
      confirmPassword: '',
      termsOfService: false,
    },

    validate: {
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const submitForm = (values: RegisterFormValues) => {
    setError(null);
    setSuccess(null);
    let { username, password, termsOfService, neuro } = values;

    if (!termsOfService) {
      setError("You must agree to the terms of service to register.");
      return;
    }
    fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, neuro }),
    })  .then(async response => {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.statusMessage || 'Registration failed');
        }
        setSuccess('Registration successful! You can now log in.');
    }).catch(error => {
        console.error('Error:', error);
        setError(error.message);
    });
  };

  return (
    <Container>
    <Title order={1} mb="md">Register</Title>

    {error && (
      <Alert variant="light" color="red" title="Registration Failed" mb="md">
        {error}
      </Alert>
    )}

    {success && (
      <Alert variant="light" color="green" title="Success" mb="md">
        {success}
      </Alert>
    )}

    <form onSubmit={form.onSubmit(values => submitForm(values))}>
      <TextInput
        withAsterisk
        label="Username"
        placeholder="YourUsername"
        key={form.key('username')}
        {...form.getInputProps('username')}
      />

       <PasswordInput
        withAsterisk
        label="Password"
        placeholder='YourPassword'
        visible={visible}
        key={form.key('password')}
        {...form.getInputProps('password')}
        onVisibilityChange={toggle}
      />
      <PasswordInput
        withAsterisk
        label="Confirm Password"
        placeholder='ConfirmYourPassword'
        visible={visible}
        key={form.key('confirmPassword')}
        {...form.getInputProps('confirmPassword')}
        onVisibilityChange={toggle}
      />
      <Select
        withAsterisk
        label="Neurodivergent"
        placeholder="Do you recognise yourself as neurodivergent?"
        key={form.key('neuro')}
        {...form.getInputProps('neuro')}
        data={[
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' },
          { value: 'prefer-not-to-say', label: 'Prefer not to say' },
        ]}
      />
      <Checkbox
        mt="md"
        label="I agree to participate in this research project and understand that my data will be used for research purposes only."
        key={form.key('termsOfService')}
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
    <Link to="/">Already have an account? Login</Link>
    </Container>
  );
}

export default Register;