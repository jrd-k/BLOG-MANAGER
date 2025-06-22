const baseUrl = "http://localhost:3000/posts";

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
}

document.addEventListener("DOMContentLoaded", main);

function displayPosts() {
  fetch(baseUrl)
    .then(res => res.json())
    .then(posts => {
      const list = document.getElementById("post-list");
      list.innerHTML = "";

      posts.forEach(post => {
        const li = document.createElement("li");
        li.textContent = post.title;
        li.dataset.id = post.id;
        li.addEventListener("click", () => handlePostClick(post.id));
        list.appendChild(li);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id); // Show first post by default
      }
    });
}

function handlePostClick(id) {
  fetch(`${baseUrl}/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <small><em>By ${post.author}</em></small><br>
        <button onclick="startEditPost(${post.id})">Edit</button>
        <button onclick="deletePost(${post.id})">Delete</button>
      `;
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value
    };

    fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
      form.reset();
      displayPosts();
    });
  });
}

function startEditPost(id) {
  fetch(`${baseUrl}/${id}`)
    .then(res => res.json())
    .then(post => {
      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-content").value = post.content;
      document.getElementById("edit-post-form").classList.remove("hidden");
      document.getElementById("edit-post-form").dataset.id = post.id;
    });
}

function addEditPostListener() {
  const form = document.getElementById("edit-post-form");
  const cancelBtn = document.getElementById("cancel-edit");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const id = form.dataset.id;

    const updatedPost = {
      title: document.getElementById("edit-title").value,
      content: document.getElementById("edit-content").value
    };

    fetch(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPost)
    })
    .then(() => {
      form.classList.add("hidden");
      displayPosts();
    });
  });

  cancelBtn.addEventListener("click", () => {
    form.classList.add("hidden");
  });
}

function deletePost(id) {
  fetch(`${baseUrl}/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    document.getElementById("post-detail").innerHTML = "<h3>Click a post title to see details</h3>";
    displayPosts();
  });
}
