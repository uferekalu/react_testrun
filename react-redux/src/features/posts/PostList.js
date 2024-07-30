import React from 'react'
import { useSelector } from 'react-redux'
import { selectAllPosts } from './postsSlice'
import './posts.css'

const PostList = () => {
  const posts = useSelector(selectAllPosts)

  const renderedPosts = posts.map((post) => (
    <article key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 100)}</p>
    </article>
  ))

  return (
    <div className="posts">
      <section>
        <h2>Posts</h2>
        {renderedPosts}
      </section>
    </div>
  )
}

export default PostList
