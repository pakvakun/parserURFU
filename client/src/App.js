import React, { useState, useEffect } from 'react';
import './App.scss';
import Axios from 'axios';

function App() {
  const [techItems, setTechItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const callAPI = async () => {
    setLoading(true)
    const res = await Axios.get('/', {
      page
    })
    setPage(page => page + 1)
    setTechItems(techItems.concat(res.data))
    setLoading(false)
  }

  const saveAllData = () => {
    localStorage.setItem('techItems', JSON.stringify(techItems))
    localStorage.setItem('page', JSON.stringify(page))
  }

  useEffect(() => {
    const techItems = JSON.parse(localStorage.getItem('techItems'));
    const page = JSON.parse(localStorage.getItem('page'))
    if (techItems) {
      setTechItems(
        techItems 
      )
    }
    if (page) {
      setPage(
       page
      )
    }
  }, [])
  return (
    <div className="App">
      <nav className='col'>
        <button className='button' onClick={() => callAPI()}>get</button>
        <button className='button' onClick={() => saveAllData() }>save</button>
      </nav>
      <main className='main'>
        <div className='main__container'>
          {
            loading &&
            <span>Loading...</span>
          }
          {
            techItems.length || loading
            ? techItems.map((item, key) => {
              if (item) {
                return <div className='main__container_item' key={key}>
                  <div className='item' key={key}>
                    <div className='item__content'>
                      <input type='text' className='item__content_header' value={item.header} />
                      {
                        item.techFeatures?.length &&
                          <div style={{padding: '10px'}}>
                            {
                              item.techFeatures.map((feature, index) => <div className='item__content_feature'>
                                <div className='item__content_feature-text' key={index * 1000 * Math.random()}>
                                  {feature.field}
                                </div>
                                <div className='item__content_feature-text'>
                                  {feature.value}
                                </div>
                              </div>
                              )
                            }
                          </div>
                      }
                      </div>
                  </div>
                </div>
              } else {
                return null
              }
            }
            )
            : <div>Тут будут данные</div>
          }
        </div>
      </main>
    </div>
  );
}

export default App;
