export type MockUserStatus = 'Active' | 'Inactive';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  status: MockUserStatus;
}

const departments = ['HR', 'Engineering', 'Sales', 'Finance', 'Support', 'Marketing'];

const sampleNames = [
  'Alex Carter',
  'Briana Patel',
  'Carlos Reyes',
  'Danielle Smith',
  'Ethan Nguyen',
  'Fiona Grant',
  'Gabriel Kim',
  'Hannah Lee',
  'Isaac Martinez',
  'Jade Thompson',
  'Kevin Wong',
  'Lena Fischer',
  'Maya Brooks',
  'Noah Clark',
  'Olivia Moore',
  'Parker Davis',
  'Quinn Taylor',
  'Riley Jensen',
  'Sofia Alvarez',
  'Theo Schultz',
  'Uma Joshi',
  'Victor Russo',
  'Willow Green',
  'Xander Liu',
  'Yara Hassan',
  'Zoe Patel',
  'Adrian Cole',
  'Bella Reyes',
  'Caleb Morgan',
  'Diana Ortiz',
  'Evan Brooks',
  'Faith Young',
  'Gavin Clark',
  'Hailey Price',
  'Ian Powell',
  'Jasmine Foster',
  'Kendall Rivera',
  'Liam Hayes',
  'Mila Bell',
  'Nathan Wright',
  'Olive Cooper',
  'Preston Barnes',
  'Quincy Hart',
  'Raven Silva',
  'Samuel Knight',
  'Tara Bennett',
  'Ulrich Meyer',
  'Valerie Hayes',
  'Wesley King',
  'Ximena Ortiz',
];

const getRandomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const formatEmployeeId = (idx: number) => `EMP-${(idx + 1).toString().padStart(4, '0')}`;

const generateId = (idx: number) => `user-${(idx + 1).toString().padStart(4, '0')}`;

const createMockUser = (index: number): MockUser => {
  const name = sampleNames[index % sampleNames.length];
  const [firstName, lastName] = name.split(' ');
  const normalizedEmail = `${firstName}.${lastName}`.toLowerCase();

  return {
    id: generateId(index),
    name,
    email: `${normalizedEmail}@example.com`,
    employeeId: formatEmployeeId(index),
    department: getRandomItem(departments),
    status: index % 7 === 0 ? 'Inactive' : 'Active',
  };
};

const mockUsers: MockUser[] = Array.from({ length: 50 }, (_, idx) => createMockUser(idx));

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUsers(): Promise<MockUser[]> {
  await delay(220);
  return [...mockUsers];
}

export async function createUser(payload: {
  name: string;
  email: string;
  employeeId: string;
  department: string;
}): Promise<MockUser> {
  await delay(170);
  const nextIndex = mockUsers.length;
  const newUser: MockUser = {
    id: generateId(nextIndex),
    name: payload.name,
    email: payload.email,
    employeeId: payload.employeeId,
    department: payload.department,
    status: 'Active',
  };

  // Add newest entries to the front so list feels fresh.
  mockUsers.unshift(newUser);
  return newUser;
}

export async function updateUser(
  id: string,
  payload: Partial<Pick<MockUser, 'name' | 'email' | 'employeeId' | 'department'>>,
): Promise<MockUser> {
  await delay(170);
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw new Error('User not found');
  Object.assign(user, payload);
  return { ...user };
}

export async function deleteUser(id: string): Promise<void> {
  await delay(150);
  const idx = mockUsers.findIndex((u) => u.id === id);
  if (idx !== -1) mockUsers.splice(idx, 1);
}

export async function setUserStatus(id: string, status: MockUserStatus): Promise<MockUser> {
  await delay(150);
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw new Error('User not found');
  user.status = status;
  return { ...user };
}
