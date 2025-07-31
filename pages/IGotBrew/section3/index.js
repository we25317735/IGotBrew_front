import React from 'react'
import styles from './assets/styles/style.module.scss'
import Image from 'next/image'
import { FaAngleRight } from 'react-icons/fa'
import Link from 'next/link'

import roast1 from './assets/imgs/bake.png'
import bean from './assets/imgs/bean.png'
import brew1 from './assets/imgs/brew.png'
import brew2 from './assets/imgs/brewing1.jpg'
import buttonmask from './assets/imgs/buttonMask.png'
import certificate1 from './assets/imgs/certificate.png'
import certificate2 from './assets/imgs/certificate5.jpg'
import course1 from './assets/imgs/course4.jpg'
import experience1 from './assets/imgs/experience.png'
import experience2 from './assets/imgs/introcoffee1.jpg'
import knowledge1 from './assets/imgs/knowledge.png'
import latteart1 from './assets/imgs/latteart4.jpg'
import latteart2 from './assets/imgs/latteart.png'
import roast2 from './assets/imgs/roast2.jpeg'

export default function Section3() {
  return (
    <>
      <div className={`${styles['section4c']}`}>
        <div className={`${styles['courseNavbar']}`}>
          <div className={`${styles['cnleft']}`}>
            <div className={`${styles['cntitle']}`}>咖啡人的必修課</div>
            <div className={`${styles['cnsubtitle']}`}>成為自己的咖啡大師</div>
            <div className={`${styles['cnsubtitle-container']}`}></div>
          </div>
          <Link href="/course">
            <div className={`${styles['buttonguide']}`}>
              <div className={`${styles['buttonmask']}`}>
                <Image src={buttonmask} alt="" />
              </div>
              <div className={`${styles['button-content']}`}>
                <div className={`${styles['button-text']}`}>課程一覽</div>
                <div className={`${styles['button-icon']}`}>
                  <FaAngleRight />
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className={`${styles['courseContainer']} container-fluid`}>
          <div className={`${styles['contentdesk']}`}>
            <div className={`${styles['cfirst-row']}`}>
              <a href={`/course?category=1`} className={`${styles['ccarda']}`}>
                <div className={`${styles['ccardadown']} ${styles['ccard1']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>證照課程</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      攀上咖啡之巔
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={certificate1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardaup']} ${styles['ccard1']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>證照課程</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      攀上咖啡之巔
                    </div>
                  </div>
                </div>
              </a>
              <a href={`/course?category=3`} className={`${styles['ccardb']}`}>
                <div className={`${styles['ccardbdown']} ${styles['ccard2']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>咖啡知識</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      探索咖啡的奧妙
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={knowledge1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardbup']} ${styles['ccard2']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>咖啡知識</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      探索咖啡的奧妙
                    </div>
                  </div>
                </div>
              </a>
              <a href={`/course?category=2`} className={`${styles['ccardc']}`}>
                <div className={`${styles['ccardcdown']} ${styles['ccard1']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>體驗課程</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      踏入咖啡殿堂的大門
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={experience1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardcup']} ${styles['ccard1']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>體驗課程</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      踏入咖啡殿堂的大門
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className={`${styles['csecond-row']}`}>
              <a href={`/course?category=4`} className={`${styles['ccardd']}`}>
                <div className={`${styles['ccardddown']} ${styles['ccard2']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>拉花</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      咖啡與奶碰撞的藝術
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={latteart2} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccarddup']} ${styles['ccard2']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>拉花</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      咖啡與奶碰撞的藝術
                    </div>
                  </div>
                </div>
              </a>
              <a href={`/course?category=5`} className={`${styles['ccarde']}`}>
                <div className={`${styles['ccardedown']} ${styles['ccard3']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>手沖</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      萃取每一滴純粹的美味
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={brew1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardeup']} ${styles['ccard3']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>手沖</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      萃取每一滴純粹的美味
                    </div>
                  </div>
                </div>
              </a>
              <a href={`/course?category=6`} className={`${styles['ccardf']}`}>
                <div className={`${styles['ccardfdown']} ${styles['ccard2']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>烘焙</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      沉浸咖啡豆的香氣
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={roast1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardfup']} ${styles['ccard2']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>烘焙</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      沉浸咖啡豆的香氣
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className={`${styles['contentphone']}`}>
            <div className={`${styles['cfirst-row']}`}>
              <a href={`/course?category=1`} className={`${styles['ccarda']}`}>
                <div className={`${styles['ccardadown']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>證照課程</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      攀上咖啡之巔
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={certificate1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardaup']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>證照課程</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      攀上咖啡之巔
                    </div>
                  </div>
                </div>
              </a>
              <a href={`/course?category=2`} className={`${styles['ccardc']}`}>
                <div className={`${styles['ccardcdown']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>體驗課程</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      踏入咖啡殿堂的大門
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={experience1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardcup']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>體驗課程</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      踏入咖啡殿堂的大門
                    </div>
                  </div>
                </div>
              </a>
            </div>

            <div className={`${styles['csecond-row']}`}>
              <a href={`/course?category=3`} className={`${styles['ccardb']}`}>
                <div className={`${styles['ccardbdown']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>咖啡知識</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      探索咖啡的奧妙
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={knowledge1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardbup']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>咖啡知識</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      探索咖啡的奧妙
                    </div>
                  </div>
                </div>
              </a>
              <a href={`/course?category=4`} className={`${styles['ccardd']}`}>
                <div className={`${styles['ccardddown']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>拉花</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      咖啡與奶碰撞的藝術
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={latteart2} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccarddup']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>拉花</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      咖啡與奶碰撞的藝術
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className={`${styles['cthird-row']}`}>
              <a href={`/course?category=5`} className={`${styles['ccarde']}`}>
                <div className={`${styles['ccardedown']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>手沖</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      萃取每一滴純粹的美味
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={brew1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardeup']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>手沖</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      萃取每一滴純粹的美味
                    </div>
                  </div>
                </div>
              </a>
              <a href={`/course?category=6`} className={`${styles['ccardf']}`}>
                <div className={`${styles['ccardfdown']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>烘焙</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      沉浸咖啡豆的香氣
                    </div>
                  </div>
                  <div className={`${styles['ccard-image']}`}>
                    <Image src={roast1} alt="" />
                  </div>
                </div>
                <div className={`${styles['ccardfup']} ${styles['ccard']}`}>
                  <div className={`${styles['ccard-word']}`}>
                    <div className={`${styles['ccard-title']}`}>烘焙</div>
                    <div className={`${styles['ccard-subtitle']}`}>
                      沉浸咖啡豆的香氣
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className={`${styles['downbutton']}`}>
              <a href={`/course`}>
                <div className={`${styles['buttonguide']}`}>
                  <div className={`${styles['buttonmask']}`}>
                    <Image src={buttonmask} alt="" />
                  </div>
                  <div className={`${styles['button-content']}`}>
                    <div className={`${styles['button-text']}`}>課程一覽</div>
                    <div className={`${styles['button-icon']}`}>
                      <FaAngleRight />
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
