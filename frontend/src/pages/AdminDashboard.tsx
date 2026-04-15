import { useEffect, useState } from 'react';
import { Button, Container, Table, Title, Group, Badge, Modal, PasswordInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface User {
  id: string;
  username: string;
  currentPhase: string;
  status: string;
  failedAttempts: number;
  locked: boolean;
  loginHistory: {
    id: string;
    attempt: number;
    success: boolean;
    phase: number | null;
    created_at: string;
  }[];
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [historyOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false);

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    console.log("Fetching users with token:", token);
    fetch('http://localhost:3000/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setUsers(data.users);
      }
    })
    .catch(err => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleReleasePhase = (userId: string) => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/admin/phase/release', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userIds: [userId] })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchUsers();
      } else {
        alert("Failed to release phase");
      }
    });
  };

  const handleResetPassword = () => {
    if (!selectedUser || !newPassword) return;
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/admin/users/reset-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: selectedUser.id, newPassword })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Password reset successfully");
        close();
        setNewPassword('');
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Container size="lg" mt="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Superadmin Dashboard</Title>
        <Button onClick={handleLogout} color="red" variant="light">Logout</Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Username</Table.Th>
            <Table.Th>Current Phase</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Failed Attempts</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>{user.username}</Table.Td>
              <Table.Td>{user.currentPhase}</Table.Td>
              <Table.Td>
                <Badge color={user.locked ? 'red' : user.status === 'Completed' ? 'green' : 'blue'}>
                  {user.locked ? 'Locked' : user.status}
                </Badge>
              </Table.Td>
              <Table.Td>{user.failedAttempts}</Table.Td>
              <Table.Td>
                <Group gap="sm">
                  <Button 
                    size="xs" 
                    disabled={user.status === 'Active' && !user.locked}
                    onClick={() => handleReleasePhase(user.id)}
                  >
                    Release Next Phase
                  </Button>
                  <Button 
                    size="xs" 
                    color="orange"
                    onClick={() => { setSelectedUser(user); open(); }}
                  >
                    Reset Password
                  </Button>
                  <Button 
                    size="xs" 
                    color="gray"
                    onClick={() => { setSelectedUser(user); openHistory(); }}
                  >
                    View History
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={`Reset Password for ${selectedUser?.username}`}>
        <PasswordInput 
          label="New Password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          mb="md"
        />
        <Button onClick={handleResetPassword} fullWidth>Submit Reset</Button>
      </Modal>

      <Modal opened={historyOpened} onClose={closeHistory} title={`Login History for ${selectedUser?.username}`} size="lg">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Attempt</Table.Th>
              <Table.Th>Phase</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Time</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {selectedUser?.loginHistory.map((metric) => (
              <Table.Tr key={metric.id}>
                <Table.Td>{metric.attempt}</Table.Td>
                <Table.Td>{metric.phase || 'N/A'}</Table.Td>
                <Table.Td>
                  <Badge color={metric.success ? 'green' : 'red'}>
                    {metric.success ? 'Success' : 'Failed'}
                  </Badge>
                </Table.Td>
                <Table.Td>{new Date(metric.created_at).toLocaleString()}</Table.Td>
              </Table.Tr>
            ))}
            {selectedUser?.loginHistory.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4} align="center">No login attempts recorded.</Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;