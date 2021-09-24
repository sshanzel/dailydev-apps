import request from 'graphql-request';
import React, { ReactElement } from 'react';
import { useInfiniteQuery } from 'react-query';
import {
  CommentUpvotesData,
  COMMENT_UPVOTES_BY_ID_QUERY,
} from '../../graphql/comments';
import { DEFAULT_UPVOTES_PER_PAGE } from '../../graphql/common';
import useFeedInfiniteScroll from '../../hooks/feed/useFeedInfiniteScroll';
import { apiUrl } from '../../lib/config';
import { UpvoterListPlaceholderProps } from '../profile/UpvoterListPlaceholder';
import { ModalProps } from './StyledModal';
import { UpvotedPopupModal } from './UpvotedPopupModal';

interface CommentUpvotersModalProps extends ModalProps {
  commentId: string;
  listPlaceholderProps: UpvoterListPlaceholderProps;
}

export function CommentUpvotersModal({
  commentId,
  listPlaceholderProps,
  ...modalProps
}: CommentUpvotersModalProps): ReactElement {
  const commentUpvotesQueryKey = ['commentUpvotes', commentId];
  const query = useInfiniteQuery<CommentUpvotesData>(
    commentUpvotesQueryKey,
    ({ pageParam }) =>
      request(`${apiUrl}/graphql`, COMMENT_UPVOTES_BY_ID_QUERY, {
        id: commentId,
        first: DEFAULT_UPVOTES_PER_PAGE,
        after: pageParam,
      }),
    {
      enabled: !!commentId,
      getNextPageParam: (lastPage) =>
        lastPage.commentUpvotes.pageInfo.hasNextPage &&
        lastPage.commentUpvotes.pageInfo.endCursor,
    },
  );

  const upvotes = React.useMemo(
    () =>
      query?.data?.pages?.reduce((list, page) => {
        page.commentUpvotes.edges.forEach((edge) => list.push(edge.node));

        return list;
      }, []) || [],
    [query],
  );

  const canFetchMore =
    !query.isLoading &&
    !query.isFetchingNextPage &&
    query.hasNextPage &&
    upvotes.length > 0;

  const infiniteScrollRef = useFeedInfiniteScroll(
    query?.fetchNextPage,
    canFetchMore,
    false,
  );

  return (
    <UpvotedPopupModal
      {...modalProps}
      listProps={{ upvotes }}
      listPlaceholderProps={listPlaceholderProps}
    >
      <div
        className="absolute bottom-0 left-0 h-px w-px opacity-0 pointer-events-none"
        ref={infiniteScrollRef}
      />
    </UpvotedPopupModal>
  );
}

export default CommentUpvotersModal;
