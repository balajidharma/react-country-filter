import React from 'react';

class CountryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      q: '',
      searchParam: ['capital', 'name', 'numericCode'],
      filterParam: ['All']
    };
  }

  search(items) {
    return items.filter(item => {
      if (item.region == this.state.filterParam) {
        return this.state.searchParam.some(newItem => {
          return (
            item[newItem]
              .toString()
              .toLowerCase()
              .indexOf(this.state.q.toLowerCase()) > -1
          );
        });
      } else if (this.state.filterParam == 'All') {
        return this.state.searchParam.some(newItem => {
          if (item[newItem]) {
            return (
              item[newItem]
                .toString()
                .toLowerCase()
                .indexOf(this.state.q.toLowerCase()) > -1
            );
          } else {
            return [];
          }
        });
      }
    });
  }

  handleFliterClick(e) {
    this.setState({
      filterParam: e.target.value
    });
  }

  handleSearch(e) {
    this.setState({
      q: e.target.value
    });
  }

  componentDidMount() {
    fetch('https://restcountries.eu/rest/v2/all')
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { error, isLoaded, items, q } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="wrapper">
          <div className="search-wrapper">
            <label htmlFor="search-form">
              <input
                type="search"
                name="search-form"
                id="search-form"
                className="search-input"
                placeholder="Search for..."
                defaultValue={q}
                onChange={this.handleSearch.bind(this)}
              />
              <span className="sr-only">Search countries here</span>
            </label>

            <div className="select">
              <select
                onChange={this.handleFliterClick.bind(this)}
                className="custom-select"
                aria-label="Filter Countries By Region"
              >
                <option value="All">Filter By Region</option>
                <option value="Africa">Africa</option>
                <option value="Americas">America</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
              </select>
              <span className="focus" />
            </div>
          </div>
          <ul className="card-grid">
            {this.search(items).map(item => (
              <li key={item.id}>
                <article className="card" key={item.callingCodes}>
                  <div className="card-image">
                    <img src={item.flag} alt={item.name} />
                  </div>
                  <div className="card-content">
                    <h2 className="card-name">{item.name}</h2>
                    <ol className="card-list">
                      <li>
                        population: <span>{item.population}</span>
                      </li>
                      <li>
                        Region: <span>{item.region}</span>
                      </li>
                      <li>
                        Capital: <span>{item.capital}</span>
                      </li>
                    </ol>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
}

export default CountryList;
