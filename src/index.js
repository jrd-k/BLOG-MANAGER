const BASE_URL = "http://localhost:3000/posts";

document.addEventListener("DOMContentLoaded", main);

function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const list = document.getElementById("post-list");
      list.innerHTML = "";
      posts.forEach(post => {
        const li = document.createElement("li");
        li.textContent = post.title;
        li.addEventListener("click", () => handlePostClick(post));
        list.appendChild(li);
      });

      // Display first post's detail by default
      if (posts.length > 0) handlePostClick(posts[0]);
    });
}

function handlePostClick(post) {
  const detail = document.getElementById("post-detail");
  detail.innerHTML = `
    <h2>${post.title}</h2>
    <p><strong>By:</strong> ${post.author}</p>
    <p>${post.content}</p>
    <button onclick="showEditForm(${post.id})">Edit</button>
    <button onclick="deletePost(${post.id})">Delete</button>
  `;

  // Store current post id for editing
  detail.dataset.currentId = post.id;
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const newPost = {
      title: form.title.value,
      author: form.author.value,
      content: form.content.value
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        form.reset();
      });
  });
}

function showEditForm(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-content").value = post.content;
      document.getElementById("edit-post-form").classList.remove("hidden");

      const editForm = document.getElementById("edit-post-form");
      editForm.onsubmit = e => {
        e.preventDefault();
        const updatedPost = {
          title: editForm["edit-title"].value,
          content: editForm["edit-content"].value
        };

        fetch(`${BASE_URL}/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedPost)
        })
          .then(res => res.json())
          .then(() => {
            displayPosts();
            editForm.classList.add("hidden");
          });
      };

      document.getElementById("cancel-edit").onclick = () => {
        editForm.classList.add("hidden");
      };
    });
}

function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      displayPosts();
      document.getElementById("post-detail").innerHTML =
        "<p>Select a post to see details.</p>";
    });
}
