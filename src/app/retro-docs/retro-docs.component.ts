import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RetroDocsService, Entry } from './services/retro-docs.service';

@Component({
  selector: 'app-retro-docs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retro-docs.component.html',
  styleUrl: './retro-docs.component.scss'
})
export class RetroDocsComponent implements OnInit {
  categories = ['HTML', 'CSS', 'JavaScript'];
  selectedCategory = 'All';
  searchTerm = '';
  selectedEntry: Entry | null = null;
  showNewEntryModal = false;
  showDeleteModal = false;
  entryToDelete: Entry | null = null;
  entries: Entry[] = [];

  newEntry: Partial<Entry> = {
    title: '',
    description: '',
    category: '',
    tags: []
  };
  tagInput = '';

  showEditModal = false;
  editEntry: Partial<Entry> = {
    title: '',
    description: '',
    category: '',
    tags: []
  };
  editTagInput = '';

  constructor(private retroDocsService: RetroDocsService) {}

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.retroDocsService.getEntries().subscribe(entries => {
      this.entries = entries;
    });
  }

  get filteredEntries() {
    return this.entries.filter(entry => {
      const matchesCategory = this.selectedCategory === 'All' || entry.category === this.selectedCategory;
      const matchesSearch = this.searchTerm === '' || 
        entry.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  showEntryDetails(entry: Entry) {
    this.selectedEntry = entry;
  }

  closeModal() {
    this.selectedEntry = null;
  }

  openNewEntryModal() {
    this.showNewEntryModal = true;
  }

  closeNewEntryModal() {
    this.showNewEntryModal = false;
    this.resetNewEntry();
  }

  async addEntry() {
    if (this.newEntry.title && this.newEntry.description && this.newEntry.category) {
      try {
        const tags = this.tagInput
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .map(tag => tag.toUpperCase()); 

        await this.retroDocsService.addEntry({
          title: this.newEntry.title,
          description: this.newEntry.description,
          category: this.newEntry.category,
          tags: tags,
          created: new Date()
        });
        this.closeNewEntryModal();
      } catch (error) {
        console.error('Error adding entry:', error);
      }
    }
  }

  private resetNewEntry() {
    this.newEntry = {
      title: '',
      description: '',
      category: '',
      tags: []
    };
    this.tagInput = '';
  }

  openDeleteModal(entry: Entry) {
    this.entryToDelete = entry;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.entryToDelete = null;
  }

  async deleteEntry() {
    if (this.entryToDelete?.id) {
      try {
        await this.retroDocsService.deleteEntry(this.entryToDelete.id);
        this.closeDeleteModal();
        this.closeModal();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  }

  openEditModal(entry: Entry) {
    this.editEntry = { 
      id: entry.id, 
      title: entry.title, 
      description: entry.description, 
      category: entry.category, 
      tags: [...entry.tags] 
    };
    this.editTagInput = this.editEntry.tags?.join(', ') || '';
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editEntry = {
      title: '',
      description: '',
      category: '',
      tags: []
    };
    this.editTagInput = '';
  }

  async updateEntry() {
    if (this.editEntry && this.editEntry.id && this.editEntry.title && this.editEntry.description && this.editEntry.category) {
      try {
        const updatedTags = this.editTagInput
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .map(tag => tag.toUpperCase());

        const updatedEntry = {
          ...this.editEntry,
          tags: updatedTags
        } as Entry;

        await this.retroDocsService.updateEntry(updatedEntry.id!, updatedEntry);

        const index = this.entries.findIndex(e => e.id === updatedEntry.id);
        if (index > -1) {
          this.entries[index] = updatedEntry;
        }

        this.closeEditModal();
        this.closeModal();
      } catch (error) {
        console.error('Error updating entry:', error);
      }
    }
  }
}
