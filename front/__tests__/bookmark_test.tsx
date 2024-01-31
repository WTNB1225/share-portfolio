import "@testing-library/jest-dom"
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Bookmark from '@/app/[user]/bookmark/page';

jest.mock('axios');

describe('Bookmark', () => {
  it('fetches bookmarks on mount', async () => {
    const mockData = [
      { post_id: '1', data: 'post1' },
      { post_id: '2', data: 'post2' },
    ];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(<Bookmark />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_ENDPOINT}/1/bookmarks`);

    await waitFor(() => expect(screen.getByText('post1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('post2')).toBeInTheDocument());
  });

  it('does not fetch bookmarks if there is an error', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching bookmarks'));

    render(<Bookmark />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_ENDPOINT}/1/bookmarks`);

    expect(screen.queryByText('post1')).not.toBeInTheDocument();
    expect(screen.queryByText('post2')).not.toBeInTheDocument();
  });
});