import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setUsers } from '../store/features/userSlice';
import axios from '../services/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  users: User[];
}

const Home = ({ users }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector((state: RootState) => state.user.users);

  dispatch(setUsers(users));

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {userList.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await axios.get('/users');
  return {
    props: {
      users: response.data,
    },
  };
};

export default Home;
