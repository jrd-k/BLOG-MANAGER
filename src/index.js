const BASE_URL = "http://localhost:3000/posts";

// === Load all posts and display them ===
function displayPosts() {
  fetch(BASE_URL)
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
        handlePostClick(posts[0].id); // Show first post automatically
      }
    });
}

// === Show full details for a single post ===
function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button id="edit-button">Edit</button>
        <button id="delete-button">Delete</button>
      `;

      // Handle Edit button
      document.getElementById("edit-button").addEventListener("click", () => {
        showEditForm(post);
      });

      // Handle Delete button
      document.getElementById("delete-button").addEventListener("click", () => {
        deletePost(post.id);
      });
    });
}

// === Add new post form listener ===
function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        displayPosts();
      });
  });
}

// === Show Edit Form with data pre-filled ===
function showEditForm(post) {
  const form = document.getElementById("edit-post-form");
  form.classList.remove("hidden");

  form["edit-title"].value = post.title;
  form["edit-content"].value = post.content;

  // Handle form submission
  form.onsubmit = function (event) {
    event.preventDefault();

    const updatedPost = {
      title: form["edit-title"].value,
      content: form["edit-content"].value
    };

    fetch(`${BASE_URL}/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(() => {
        form.classList.add("hidden");
        displayPosts();
      });
  };

  // Cancel button
  document.getElementById("cancel-edit").addEventListener("click", () => {
    form.classList.add("hidden");
  });
}

// === Delete a post ===
function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      document.getElementById("post-detail").innerHTML = "<h3>Select a post to view details</h3>";
      displayPosts();
    });
}

// === Start the app ===
function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener("DOMContentLoaded", main);
