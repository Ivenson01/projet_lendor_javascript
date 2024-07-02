document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const nameInput = document.getElementById('name-input');
    const commentInput = document.getElementById('comment-input');
    const commentsList = document.getElementById('comments-list');
  
    // Fonction pour charger les commentaires
    const loadComments = async () => {
      try {
        const response = await fetch('/api/comments');
        const comments = await response.json();
        commentsList.innerHTML = ''; // Effacer le contenu actuel de la liste des commentaires
        comments.forEach(comment => {
          const commentDiv = document.createElement('div');
          commentDiv.classList.add('comment-item');
          commentDiv.innerHTML = `
            <img src="default-profile.jpg" alt="Profile Image">
            <div class="comment-content">
              <blockquote>${comment.split(': ')[1]}</blockquote>
              <div class="comment-name">${comment.split(': ')[0]}</div>
            </div>
          `;
          commentsList.appendChild(commentDiv);
        });
        // console.log('Commentaires chargés:', comments);
      } catch (error) {
        console.error('Erreur lors du chargement des commentaires:', error);
      }
    };
  
    // Ajouter un nouveau commentaire
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newComment = {
        name: nameInput.value.trim(),
        text: commentInput.value.trim()
      };
      if (newComment.name && newComment.text) {
        try {
          const response = await fetch('/api/comments', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)
          });
          if (response.ok) {
            nameInput.value = '';
            commentInput.value = '';
            console.log('Commentaire ajouté:', newComment);
            loadComments(); // Charger les commentaires après l'ajout d'un nouveau
          } else {
            console.error('Erreur lors de l\'ajout du commentaire:', response.statusText);
          }
        } catch (error) {
          console.error('Erreur lors de la requête POST:', error);
        }
      }
    });
  
    // Charger les commentaires au chargement de la page
    loadComments();
  });
  