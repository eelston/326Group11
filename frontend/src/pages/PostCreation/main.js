//import { Events } from '../../eventhub/PostingEvents.js';
//import { EventHub } from '../../eventhub/EventHub.js';


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const addTagsBtn = document.getElementById('add-tags-btn');
    const tagInputView = document.getElementById('tag-input-view');
    const tagInput = document.getElementById('tag-input');
    const tagList = document.getElementById('tag-list');
  
    const tags = [];
  
    // Toggle the tag input view
    addTagsBtn.addEventListener('click', () => {
      const isHidden = tagInputView.classList.toggle('hidden');
      addTagsBtn.textContent = isHidden ? 'Open Tag Menu' : 'Close Tag Menu';
      tagInput.focus();
    });
  
    // Add tag on Enter
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && tagInput.value.trim() !== '') {
        e.preventDefault();

        const tagText = tagInput.value.trim();
        const tag = document.createElement('div');
        tag.classList.add('tag');

        const tagLabel = document.createElement('span');
        tagLabel.textContent = tagText;

        const removeBtn = document.createElement('span');
        removeBtn.textContent = '✕';
        removeBtn.classList.add('remove-tag');
        removeBtn.title = 'Remove tag';
        
        tag.appendChild(removeBtn);
        tag.appendChild(tagLabel);

        tagList.appendChild(tag);
        tagInput.value = '';
      }
    });

    tagList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-tag')) {
          const tag = e.target.parentElement;
          tag.remove();
        }
      });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const post = {
        title: document.getElementById('post-title').value.trim(),
        location: document.getElementById('post-location').value.trim(),
        body: document.getElementById('post-body').value.trim(),
        tags: tags,
        createdAt: new Date()
      };
  
      console.log('Post to save:', post); // Replace with savePost() or IndexedDB logic
  
      alert('Post saved!');
      form.reset();
      tagList.innerHTML = '';
      tags.length = 0;
    });
  });