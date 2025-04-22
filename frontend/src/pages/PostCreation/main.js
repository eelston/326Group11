import { Events } from '../../eventhub/PostingEvents.js';
import { EventHub } from '../../eventhub/EventHub.js';
import { IndexedDB } from '../../utility/indexeddb.js';
import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';

const navbarComponent = new NavbarComponent();
navbarComponent.render();


document.addEventListener('DOMContentLoaded', () => {
  const eventHub = EventHub.getInstance();
  const db = IndexedDB;

  //subscriptions

  //submit post
  eventHub.subscribe(Events.SEND_POST, () => {
    window.location.href = "/frontend/src/pages/PostBrowsing/index.html";
  });

  //cancel post
  eventHub.subscribe(Events.CANCEL_POST, () => {
    window.location.href = "/frontend/src/pages/PostBrowsing/index.html";
  });

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
  
  // Add tags
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

      tags.push(tagText);
    }
  });

  tagList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-tag')) {
      const tag = e.target.parentElement;
      const tagText = tag.querySelector('span').textContent;

      const index = tags.indexOf(tagText);
      if (index !== -1) {
        tags.splice(index, 1);
      }

      tag.remove();
    }
  });

  const cancelBtn = document.getElementById('submit-cancel')
  let cancelClicked = false;

  //Handle cancel post
  cancelBtn.addEventListener('click', () => {
    eventHub.publish(Events.CANCEL_POST);
  })
    
  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('post-title');
    const title = titleInput.value.trim();
    
    if (title === ''){
      titleInput.placeholder = 'Post name required.';
      titleInput.classList.add('input-error');
      titleInput.focus();
      return;
    }

    titleInput.classList.remove('input-error');

    const payload = {
      title: document.getElementById('post-title').value.trim(),
      location: document.getElementById('post-location').value.trim(),
      body: document.getElementById('post-body').value.trim(),
      tags: tags,
      createdAt: new Date()
    };
  
    db.savePost(payload).then(() => {
      form.reset();
      tagList.innerHTML = '';
      tags.length = 0;
      eventHub.publish("SEND_POST");
    });
  });
});