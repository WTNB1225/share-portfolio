import "@testing-library/jest-dom"
import { render, fireEvent } from '@testing-library/react';
import UserWork from '@/components/UserWork';

describe('UserWork', () => {
  const mockHandleLike = jest.fn();
  const mockHandleUnLike = jest.fn();

  it('renders correctly', () => {
    const { getByText } = render(
      <UserWork
        avatar="avatar.jpg"
        name="User1"
        id="1"
        image="image.jpg"
        title="Title"
        isLiked={false}
        handleLike={mockHandleLike}
        handleUnLike={mockHandleUnLike}
      />
    );

    expect(getByText('User1')).toBeInTheDocument();
    expect(getByText('Title')).toBeInTheDocument();
  });

  it('calls handleLike when like button is clicked', () => {
    const { getByTestId } = render(
      <UserWork
        avatar="avatar.jpg"
        name="User1"
        id="1"
        image="image.jpg"
        title="Title"
        isLiked={false}
        handleLike={mockHandleLike}
        handleUnLike={mockHandleUnLike}
      />
    );

    fireEvent.click(getByTestId('like-button'));

    expect(mockHandleLike).toHaveBeenCalled();
  });

  it('calls handleUnLike when unlike button is clicked', () => {
    const { getByTestId } = render(
      <UserWork
        avatar="avatar.jpg"
        name="User1"
        id="1"
        image="image.jpg"
        title="Title"
        isLiked={true}
        handleLike={mockHandleLike}
        handleUnLike={mockHandleUnLike}
      />
    );

    fireEvent.click(getByTestId('unlike-button'));

    expect(mockHandleUnLike).toHaveBeenCalled();
  });
});