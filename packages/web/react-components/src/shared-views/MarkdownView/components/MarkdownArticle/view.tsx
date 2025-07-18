'use client';

import {styled} from 'styled-components';

export const MarkdownArticle = styled.article`
  font-size: 1rem;

  h1 {
    font-size: 2em;
  }

  pre {
    max-width: 100%;

    border-radius: 4px;

    code {
      display: block;
      background-clip: border-box;
      padding: 10px 20px;
    }
  }

  math {
    overflow-x: auto;
    overflow-y: hidden;

    &[display='block'] {
      margin: 1lh 0;
    }

    mtd {
      text-align: start;
    }
  }

  img,
  table {
    margin: 1em auto;
  }

  img {
    max-width: 100%;
  }

  p {
    max-width: 100%;
    text-align: justify;
  }

  table {
    display: block;
    width: 100%;
    overflow: auto;
    word-break: break-word;

    th,
    td {
      border: 1px solid #ddd;
      padding: 1vh 1vw;
    }
  }

  blockquote {
    border-left: 10px solid #6cf;
    padding: 2em;

    p {
      margin: 0;
      line-height: 2em;
    }
  }

  li {
    word-break: break-all;
  }
`;
