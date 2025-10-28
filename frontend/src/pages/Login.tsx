import { Button, Checkbox, Group, PasswordInput, Container, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router';

function Login() {
      const [visible, { toggle }] = useDisclosure(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      termsOfService: false,
    },

    validate: {
      username: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid username'),
    },
  });

  return (
    <Container>
    <Title order={1}>Login</Title>
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
        onVisibilityChange={toggle}
      />

      <Checkbox
        mt="md"
        label="I agree to sell my privacy"
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