import React, { useState, useEffect } from 'react';
import './App.scss';
import Axios from 'axios';

// var page = 1

function App() {
  const [techItems, setTechItems] = useState([])
  const [page, setPage] = useState(1)
  const [timerId, setTimerId] = useState(null)

 
  const callAPI = () => {
    console.log(page);
    
    Axios({
      method: 'GET',
      url: '/',
      params: {
        page
      }
    })
    .then( res => {
      // page = page + 1
      setPage(page => page + 1)
      setTechItems(techItems.concat(res.data))
    })
    .catch(err => console.log({err}))
  }

  const callLoop = async () => {
    let timer = setInterval(() => {
      callAPI()
    }, 3000);
    setTimerId(timer)
  }

  const stopTimer = () => {
    clearInterval(timerId)
  }

  const saveAllData = () => {
    localStorage.setItem('techItems', JSON.stringify(techItems))
    localStorage.setItem('page', JSON.stringify(page))
  }

  useEffect(() => {
    setTechItems(
      JSON.parse(localStorage.getItem('techItems'))
    )
    setPage(
     JSON.parse(localStorage.getItem('page')) + 1
    )
  }, [])
  return (
    <div className="App">
      <nav className='col'>
        <button className='button' onClick={() => callAPI() }>get</button>
        <button className='button' disabled onClick={() => callLoop() }>loop</button>
        <button className='button' disabled onClick={() => stopTimer() }>stop</button>
        <button className='button' onClick={() => saveAllData() }>save</button>
      </nav>
      <main className='main'>
        <div className='main__container'>
          {
            techItems.length 
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
