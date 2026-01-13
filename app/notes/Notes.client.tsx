'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';

import SearchBox from '../../components/SearchBox/SearchBox';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import Pagination from '../../components/Pagination/Pagination';

import { fetchNotes } from '../../lib/api';
import type { NotesResponse } from '../../lib/api';
import styles from '../../components/App/App.module.css';

export default function NotesPage() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [search, setSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1); 
        setSearch(value);
      }, 500),
    []
  );

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  
  const { data, isLoading, isError } = useQuery<
    NotesResponse,
    Error,
    NotesResponse,
    [string, { page: number; perPage: number; search: string }]
  >({
    queryKey: ['notes', { page, perPage, search }],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey;
      return fetchNotes(params);
    },
  
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox onSearch={debouncedSetSearch} />
        <Pagination page={page} onPageChange={setPage} totalPages={totalPages} />
        <button className={styles.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading notes</p>}
        {!isLoading && !isError && <NoteList notes={notes} />}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onSuccess={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}