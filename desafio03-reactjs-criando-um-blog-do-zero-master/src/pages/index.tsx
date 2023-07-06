import { useState } from 'react';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '../components/Header';
import { getPrismicClient } from '../../prismicio';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(() => postsPagination.results);
  const [nextPage, setNextPage] = useState(() => postsPagination.next_page);

  const handleNextPage = async (): Promise<void> => {
    const response = await fetch(postsPagination.next_page).then(resp =>
      resp.json()
    );

    const newPosts = await response.results.map(post => {
      const postResult: Post = {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.last_publication_date),
          'dd MMM yyyy',
          { locale: ptBR }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };

      return postResult;
    });

    setPosts(oldPosts => [...oldPosts, ...newPosts]);
    setNextPage(newPosts.next_page === null ? '' : newPosts.next_page);
  };

  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>

      <Header />

      <main className={commonStyles.container}>
        <div className={styles.postContainer}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}.</p>
              <div className={styles.postFooter}>
                <time>
                  <FiCalendar /> {post.first_publication_date}
                </time>
                <span>
                  <FiUser />
                  {post.data.author}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {nextPage && (
          <button
            className={styles.loadButton}
            type="button"
            onClick={handleNextPage}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 1,
  });

  const posts = postsResponse.results.map(post => {
    const postResult: Post = {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.last_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };

    return postResult;
  });

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
