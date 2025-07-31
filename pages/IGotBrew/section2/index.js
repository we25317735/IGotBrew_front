import React from 'react'
import styles from './assets/style/style.module.scss'
import { FaArrowRight } from 'react-icons/fa'

import book from './assets/img/book.png'
import coffeelead from './assets/img/coffeelead.png'
import coffeemap from './assets/img/coffeemap.png'
import cup from './assets/img/CUP.png'
import machine1 from './assets/img/highqualitymachine.png'
import machine2 from './assets/img/MACHINE.png'
import coffeepackage from './assets/img/PACKAGE.png'
import wavebg from './assets/img/section2bg.png'
import Image from 'next/image'

export default function Section2() {
  return (
    <>
      <div className={`container-fluid ${styles['fpSection2']}`}>
        <div className={`${styles['section2bg']} `}>
          <Image src={wavebg} />
        </div>
        <div className={`${styles['inner-container']}`}>
          <div className={`${styles['s2title']}`}>
            <strong>Brew</strong>
            ，是製作美味咖啡的核心步驟，結合咖啡粉與水，以適當的時間、溫度進行萃取
            <br />
            <br />
            <strong>I GOT BREW</strong> 象徵著我們對於咖啡的熱愛與專業
          </div>
          <div className={`${styles['features']}`}>
            <div className={`${styles['feature']}`}>
              <div className={`${styles['icon']}`}>
                <Image src={coffeelead} />
              </div>
              <div className={`${styles['text']}`}>專業咖啡指導</div>
              <div className={`${styles['description']}`}>
                我們設立了各種課程，無論是初學、老手，都能學習想要的咖啡技能。
              </div>
            </div>
            <div className={`${styles['feature']}`}>
              <div className={`${styles['icon']}`}>
                <Image src={machine1} />
              </div>
              <div className={`${styles['text']}`}>高品質咖啡豆與機器</div>
              <div className={`${styles['description']}`}>
                我們精心挑選來自世界各地的咖啡豆及咖啡機，致力於提供完美的咖啡體驗
              </div>
            </div>
            <div className={`${styles['feature']}`}>
              <div className={`${styles['icon']}`}>
                <Image src={book} />
              </div>
              <div className={`${styles['text']}`}>咖啡知識分享</div>
              <div className={`${styles['description']}`}>
                我們樂於分享咖啡文化，讓您在品味的同時，也能了解更多咖啡故事。
              </div>
            </div>
            <div className={`${styles['feature']}`}>
              <div className={`${styles['icon']}`}>
                <Image src={coffeemap} />
              </div>
              <div className={`${styles['text']}`}>全台咖啡廳</div>
              <div className={`${styles['description']}`}>
                不論身在何處，咖啡地圖讓您找到最契合的咖啡廳
              </div>
            </div>
          </div>
          <div className={`${styles['products']}`}>
            <a href={`/product?type=bean`} className={`${styles['product']}`}>
              <div className={`${styles['image']}`}>
                <Image src={coffeepackage} />
              </div>
              <div className={`${styles['info']}`}>
                <div className={`${styles['iftitle']}`}>咖啡豆</div>
                <div className={`${styles['ifbutton']}`}>
                  <div className={`${styles['icon']}`}>
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            </a>
            <a
              href={`/product?type=machine`}
              className={`${styles['product']}`}
            >
              <div className={`${styles['image']}`}>
                <Image src={machine2} />
              </div>
              <div className={`${styles['info']}`}>
                <div className={`${styles['iftitle']}`}>咖啡機</div>
                <div className={`${styles['ifbutton']}`}>
                  <div className={`${styles['icon']}`}>
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            </a>
            <a href={`/product?type=other`} className={`${styles['product']}`}>
              <div className={`${styles['image']}`}>
                <Image src={cup} />
              </div>
              <div className={`${styles['info']}`}>
                <div className={`${styles['iftitle']}`}>其他/配件</div>
                <div className={`${styles['ifbutton']}`}>
                  <div className={`${styles['icon']}`}>
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
