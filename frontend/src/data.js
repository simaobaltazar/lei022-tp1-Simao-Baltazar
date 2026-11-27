export const user = {
  id: 1,
  nameUser: 'Salvador Maria',
  email: 'salvador@example.com',
  services: [
    { id: 1, nameService: 'Apple Music', type: 'student', joining: '2012-08-05T17:00:00.000Z' },
    { id: 2, nameService: 'Prime Videos', type: 'family', joining: '2023-09-04T13:00:00.000Z' },
    { id: 3, nameService: 'Netflix', type: 'individual', joining: '2024-02-10T20:00:00.000Z' },
    { id: 4, nameService: 'Spotify', type: 'family', joining: '2026-11-22T10:00:00.000Z' }
  ]
};

export const allServices = [
  { id: 1, nameService: 'Apple Music', type: 'student', joining: '2012-08-05T17:00:00.000Z', userId: 1 },
  { id: 2, nameService: 'Prime Videos', type: 'family', joining: '2023-09-04T13:00:00.000Z', userId: 1 },
  { id: 3, nameService: 'Netflix', type: 'individual', joining: '2024-02-10T20:00:00.000Z', userId: 1 },
  { id: 4, nameService: 'Netflix', type: 'family', joining: '2025-03-15T09:00:00.000Z', userId: 2 }
];