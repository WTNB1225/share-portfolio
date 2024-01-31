import { render, fireEvent, screen } from '@testing-library/react';
import EditPage from '@/app/[user]/edit/page';

describe('EditPage', () => {
  it('renders the forms correctly', () => {
    render(<EditPage />);

    expect(screen.getByLabelText('avatar')).toBeInTheDocument();
    expect(screen.getByLabelText('プロフィール')).toBeInTheDocument();
  });

  it('handles avatar change', () => {
    const handleAvatarChange = jest.fn();
    render(<EditPage  />);

    fireEvent.change(screen.getByLabelText('avatar'), { target: { files: ['avatar.jpg'] } });

    expect(handleAvatarChange).toHaveBeenCalled();
  });

  it('handles profile change', () => {
    const handleProfileChange = jest.fn();
    render(<EditPage />);

    fireEvent.change(screen.getByLabelText('プロフィール'), { target: { value: 'New profile' } });

    expect(handleProfileChange).toHaveBeenCalled();
  });

  it('handles avatar submit', () => {
    const handleAvatarSubmit = jest.fn();
    render(<EditPage />);

    fireEvent.click(screen.getByText('変更'));

    expect(handleAvatarSubmit).toHaveBeenCalled();
  });

  it('handles profile submit', () => {
    const handleProfileSubmit = jest.fn();
    render(<EditPage />);

    fireEvent.click(screen.getByText('変更'));

    expect(handleProfileSubmit).toHaveBeenCalled();
  });
});