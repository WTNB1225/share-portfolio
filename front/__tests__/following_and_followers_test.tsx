import { render, waitFor } from '@testing-library/react';
import { usePathname, useCheckLoginStatus } from '@/app/[user]/followers/page';
import Followings from '@/app/[user]/followers/page';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/hook/useCheckLoginStatus', () => ({
  useCheckLoginStatus: jest.fn(),
}));

describe('Followings', () => {
  it('calls the custom hooks', () => {
    render(<Followings />);

    expect(usePathname).toHaveBeenCalled();
    expect(useCheckLoginStatus).toHaveBeenCalled();
  });

  it('handles login status', async () => {
    (useCheckLoginStatus as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'User1' },
      isLoading: false,
    });

    const { getByText } = render(<Followings />);

    await waitFor(() => expect(getByText('User1')).toBeInTheDocument());
  });

  it('handles not logged in status', async () => {
    (useCheckLoginStatus as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    const { getByText } = render(<Followings />);

    await waitFor(() => expect(getByText('Not logged in')).toBeInTheDocument());
  });
});