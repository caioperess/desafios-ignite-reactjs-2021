import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

const getImages = async (pageParam: number): Promise<any> => {
  const response = await api.get('/api/images', {
    params: { after: pageParam },
  });

  return response.data;
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: 'images',
    queryFn: ({ pageParam }) => getImages(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.data.length > 0
          ? allPages[allPages.length - 1].after
          : undefined;
      return nextPage;
    },
  });

  const formattedData = useMemo(() => {
    if (data) {
      let formated = data.pages.map(page => page.data);
      formated = formated.flat();

      return formated;
    }
    return [];
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            type="button"
            mt="40px"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
