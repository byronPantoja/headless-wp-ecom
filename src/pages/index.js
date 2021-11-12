import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import Header from "@components/Header";
import Container from "@components/Container";
import Button from "@components/Button";

import styles from "../styles/Home.module.scss";

export default function Home({ products }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="preconnect" href="https://cdn.snipcart.com" />
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.2.2/default/snipcart.css"
        />
      </Head>
      <Header />
      <main>
        <Container>
          <h1>Developer833&apos;s Headless Wordpress Ecommerce Test</h1>
          <h2>Available Cards</h2>
          <ul className={styles.products}>
            {products.map((product) => {
              const { featuredImage } = product;
              return (
                <li key={product.productId}>
                  <Image
                    src={featuredImage.sourceUrl}
                    alt={featuredImage.altText}
                    width={featuredImage.mediaDetails.width}
                    height={featuredImage.mediaDetails.height}
                  />
                  <h3>{product.title}</h3>
                  <p>{product.productPrice}</p>
                  <p>
                    <Button
                      className="snipcart-add-item"
                      data-item-id={product.productId}
                      data-item-price={product.productPrice}
                      data-item-url="/"
                      data-item-description=""
                      data-item-image={featuredImage.sourceUrl}
                      data-item-name={product.title}
                    >
                      Add to Cart
                    </Button>
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </main>

      <footer className={styles.footer}>
        &copy; eight33digital.com, {new Date().getFullYear()}
      </footer>
      <link
        rel="stylesheet"
        href="https://cdn.snipcart.com/themes/v3.2.2/default/snipcart.css"
      />
      <Script
        async
        src="https://cdn.snipcart.com/themes/v3.2.2/default/snipcart.js"
      />
      <div
        id="snipcart"
        data-config-modal-style="side"
        data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY}
        hidden
      ></div>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "http://headlesswordpressecom.local/graphql",
    cache: new InMemoryCache(),
  });

  const response = await client.query({
    query: gql`
      query AllProducts {
        products {
          edges {
            node {
              content
              title
              uri
              product {
                productPrice
                productId
              }
              slug
              featuredImage {
                node {
                  altText
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
            }
          }
        }
      }
    `,
  });

  const products = response.data.products.edges.map(({ node }) => {
    const data = {
      ...node,
      ...node.product,
      featuredImage: {
        ...node.featuredImage.node,
      },
    };
    return data;
  });

  console.log(products);

  return {
    props: {
      products,
    },
  };
}
