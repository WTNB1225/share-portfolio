import '@testing-library/jest-dom'
import { render, waitFor, screen, act } from '@testing-library/react';

import axios from 'axios';
import Bookmark from '@/app/[user]/bookmark/page';
jest.mock('axios');

describe('Bookmark component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        name: 'Test User',
        id: '1',
      },
    });
  });

  it('calls checkLoginStatus on mount', async () => {
    await act(async () => { // Wrap the render and waitFor in act
      render(<Bookmark />);

      await waitFor(() => expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/logged_in_user', {
        withCredentials: true,
      }));
    });
  });

  it('sets user name and id after checkLoginStatus', async () => {
    await act(async () => { // Wrap the render in act
      render(<Bookmark />);
    });
  });

  it('calls getBookmark with user id', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    await act(async () => { // Wrap the render and waitFor in act
      render(<Bookmark />);

      await waitFor(() => expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/1/bookmarks'));
    });
  });

});