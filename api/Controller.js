var request = require('request-promise');
var axios = require('axios');

// var needle = require('needle');
var config = require('./Utils/config')
var linksArray = []

const getRemoteData = async (res, page) => {
    let temp = await getLinksArr()
    let infoPages = await findInfo(findIterstingLinks(xml2Arr(temp)), page)
    infoPages = infoPages.filter(item => !!item.value?.data)
    infoPages = infoPages.map(item => {
        let header = '',
            techFeatures = ''
        if (item?.value?.data) {
            item = item?.value?.data.replace(/\n/gi)
            item = item?.replace(/[\n\r\s\t]+/g, ' ')
            item = item?.replace(/(<nav.*<\/nav>)|(<head.*<\/head>)/gi, '')
            item = item?.match(/(<!-- product-inner -->.*<!-- product-inner end -->)/gi)
            item = item?.length ? item[0] : item
            header = item?.match(/(<h1.*<\/h1>)/gi)[0].replace(/(<h1>)|(<\/h1>)/gi, '')
            techFeatures = item?.match(/(<!-- tech-features -->.*<!-- tech-features end -->)/)[0].replace(/undefined/gi, '').split(/<div class="feature">/)
            techFeatures = techFeatures?.map(feature => {
                // return feature.match(/(<div .*>.*<\/div>)/gi)
                feature = feature.split(/<div/).map(item => {
                    item = item.replace(/(.+?>)/, '')
                    item = item.replace(/(<\/div>)/gi, '')
                    item = item.replace(/<!--.*-->/, '')
                    if (item.length <= 1) {
                        return item = item.replace(/ /, '')
                    } else {
                        return item
                    }
                })
                feature = feature.filter(item => !!item)

                if (feature.length >= 2) {
                    if (!feature[0].match('Артикул')) {
                        return {
                            field: feature[0].trim().replace(':', ''),
                            value: feature[1].trim().replace(':', '')
                        }
                    }
                }else {
                    return
                }
            })
            if (techFeatures) {
                delete techFeatures[0]
                techFeatures = techFeatures.filter(item => !!item)
            }
        }
        if (header && techFeatures) {
            return {header, techFeatures}
        } else {
            return null
        }
    })
    if (infoPages) {
        res.send(infoPages)
    }
}

const getLinksArr = async () => {
    let links = request(config.url)
    if(!linksArray.length) {
        linksArray = links
    }
    return linksArray
}

const xml2Arr = xml => {
    let newXml = xml.match(/(<loc>.*<\/loc>)/gi)
    return newXml.map(item => item.replace(/(<loc>)|(<\/loc>)/gi, ''))
}

const findIterstingLinks = (urlArr) => {
    const urlFiltered = urlArr.filter(item => item.split('/').length >= 7)
    return urlFiltered 
}

const findInfo = async (urlFiltered, page) => {
    const reccive_page =  page ? +page : 0
    const newUrls = urlFiltered.slice(reccive_page, reccive_page + 10)
    return Promise.allSettled(newUrls.map((item) => {
        return axios.get(item)
    }))
}

module.exports = {
    getRemoteData
}