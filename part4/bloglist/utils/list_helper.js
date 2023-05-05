const mostLikes = (blogs) => {
  const authorLikes  = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const maxLikes = Math.max(...Object.values(authorLikes))
  const mostAuthor = Object.keys(authorLikes).find(author => authorLikes[author] === maxLikes)

  return blogs.length === 0
    ? 0
    : { author: mostAuthor,
      likes: maxLikes
    }
}


const mostBlogs = (blogs) => {
  const authorBlogs  = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const maxBlogs = Math.max(...Object.values(authorBlogs))
  const mostAuthor = Object.keys(authorBlogs).find(author => authorBlogs[author] === maxBlogs)

  return blogs.length === 0
    ? 0
    : { author: mostAuthor,
      blogs: maxBlogs
    }
}


const favoriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const maxLikes = likes.reduce((a, b) => Math.max(a, b), -Infinity)

  const maxLikesBlog = blogs.find(blog => blog.likes === maxLikes)
  const result = (({ title, author, likes }) => ({ title, author, likes }))(maxLikesBlog)

  return blogs.length === 0
    ? 0
    : result
}


const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}


module.exports = {
  mostLikes, mostBlogs, favoriteBlog, totalLikes,
}