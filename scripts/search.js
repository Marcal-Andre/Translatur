// Search functionality
export function setupSearch() {
  const searchButton = document.querySelector('.search-button');
  const searchType = document.getElementById('search-type');
  const destination = document.getElementById('destination');
  const departureDate = document.getElementById('departure-date');
  const returnDate = document.getElementById('return-date');
  const travelers = document.getElementById('travelers');
  
  if (!searchButton) return;
  
  // Set minimum dates for date inputs
  if (departureDate && returnDate) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    departureDate.min = formatDate(today);
    returnDate.min = formatDate(tomorrow);
    
    // Ensure return date is after departure date
    departureDate.addEventListener('change', () => {
      const selectedDeparture = new Date(departureDate.value);
      const nextDay = new Date(selectedDeparture);
      nextDay.setDate(nextDay.getDate() + 1);
      returnDate.min = formatDate(nextDay);
      
      if (returnDate.value && new Date(returnDate.value) <= selectedDeparture) {
        returnDate.value = formatDate(nextDay);
      }
    });
  }
  
  // Search button click handler
  searchButton.addEventListener('click', () => {
    // In a real application, this would send data to a server
    // For now, we'll just show an alert with the search parameters
    let message = 'Pesquisando:';
    
    if (searchType) message += `\nTipo: ${searchType.options[searchType.selectedIndex].text}`;
    if (destination && destination.value) message += `\nDestino: ${destination.value}`;
    if (departureDate && departureDate.value) message += `\nData de Ida: ${departureDate.value}`;
    if (returnDate && returnDate.value) message += `\nData de Volta: ${returnDate.value}`;
    if (travelers) message += `\nPassageiros: ${travelers.options[travelers.selectedIndex].text}`;
    
    alert(message + '\n\nEm um site real, esta pesquisa seria processada no backend (PHP/MySQL).');
    
    // Clear form after submission
    if (destination) destination.value = '';
  });
  
  // Suggestions for destination field (simulated)
  if (destination) {
    const destinations = [
      'Rio de Janeiro, Brasil',
      'São Paulo, Brasil',
      'Salvador, Brasil',
      'Fortaleza, Brasil',
      'Paris, França',
      'Nova York, EUA',
      'Tóquio, Japão',
      'Roma, Itália',
      'Barcelona, Espanha',
      'Londres, Reino Unido'
    ];
    
    // Simple autocomplete implementation
    destination.addEventListener('input', () => {
      const value = destination.value.toLowerCase();
      if (value.length < 2) return;
      
      // In a real application, this would fetch suggestions from a server
      const matches = destinations.filter(dest => 
        dest.toLowerCase().includes(value)
      );
      
      // Display suggestions (in a real app, this would create a dropdown)
      console.log('Sugestões:', matches);
    });
  }
}