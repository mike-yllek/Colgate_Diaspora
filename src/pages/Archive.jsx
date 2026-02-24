import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Historical data (all 13 seasons) ────────────────────────────────────
   Rows within each season are ordered 1st → last place.
   toilet = rows[rows.length - 1].team (worst record / lowest PF in ties)
   ─────────────────────────────────────────────────────────────────────── */
const SEASONS = {
  "2013": [{"team":"Ben","w":8,"l":6,"pf":1489.0,"pa":1361.0,"playoffs":1,"championship":1},{"team":"Ollie","w":9,"l":5,"pf":1446.0,"pa":1229.0,"playoffs":1,"championship":0},{"team":"Mike","w":8,"l":6,"pf":1465.0,"pa":1441.0,"playoffs":1,"championship":0},{"team":"Eric","w":7,"l":7,"pf":1464.0,"pa":1506.0,"playoffs":0,"championship":0},{"team":"Dave","w":7,"l":7,"pf":1376.0,"pa":1341.0,"playoffs":0,"championship":0},{"team":"Bobby","w":7,"l":7,"pf":1374.0,"pa":1394.0,"playoffs":0,"championship":0},{"team":"Joe","w":7,"l":7,"pf":1340.0,"pa":1334.0,"playoffs":1,"championship":0},{"team":"Kenley","w":7,"l":7,"pf":1319.0,"pa":1404.0,"playoffs":0,"championship":0},{"team":"Jack","w":5,"l":9,"pf":1325.0,"pa":1495.0,"playoffs":0,"championship":0},{"team":"Andy","w":5,"l":9,"pf":1253.0,"pa":1347.0,"playoffs":0,"championship":0}],
  "2014": [{"team":"Mike","w":8,"l":5,"pf":1301.0,"pa":1082.0,"playoffs":1,"championship":1},{"team":"Dave","w":9,"l":4,"pf":1345.0,"pa":1152.0,"playoffs":1,"championship":0},{"team":"Ben","w":9,"l":4,"pf":1183.0,"pa":1110.0,"playoffs":1,"championship":0},{"team":"TJ","w":8,"l":5,"pf":1298.0,"pa":1232.0,"playoffs":1,"championship":0},{"team":"Andy","w":7,"l":6,"pf":1125.0,"pa":1197.0,"playoffs":0,"championship":0},{"team":"Kenley","w":6,"l":7,"pf":1110.0,"pa":1229.0,"playoffs":0,"championship":0},{"team":"Jack","w":5,"l":8,"pf":1213.0,"pa":1226.0,"playoffs":0,"championship":0},{"team":"Ollie","w":5,"l":8,"pf":1096.0,"pa":1133.0,"playoffs":0,"championship":0},{"team":"Bobby","w":5,"l":8,"pf":1038.0,"pa":1232.0,"playoffs":0,"championship":0},{"team":"Joe","w":3,"l":10,"pf":1111.0,"pa":1227.0,"playoffs":0,"championship":0}],
  "2015": [{"team":"Kenley","w":7,"l":6,"pf":1145.0,"pa":1155.0,"playoffs":1,"championship":1},{"team":"Bobby","w":8,"l":3,"pf":1434.0,"pa":1196.0,"playoffs":1,"championship":0},{"team":"Ollie","w":8,"l":5,"pf":1103.0,"pa":1103.0,"playoffs":1,"championship":0},{"team":"Mike","w":7,"l":5,"pf":1368.0,"pa":1246.0,"playoffs":1,"championship":0},{"team":"Joe","w":7,"l":6,"pf":1281.0,"pa":1143.0,"playoffs":0,"championship":0},{"team":"Jack","w":7,"l":5,"pf":1155.0,"pa":1167.0,"playoffs":0,"championship":0},{"team":"TJ","w":6,"l":7,"pf":1117.0,"pa":1279.0,"playoffs":0,"championship":0},{"team":"Andy","w":6,"l":7,"pf":1086.0,"pa":1141.0,"playoffs":0,"championship":0},{"team":"Dave","w":4,"l":9,"pf":1110.0,"pa":1149.0,"playoffs":0,"championship":0},{"team":"Ben","w":3,"l":10,"pf":975.0,"pa":1195.0,"playoffs":0,"championship":0}],
  "2016": [{"team":"Bobby","w":7,"l":6,"pf":1429.1,"pa":1390.3,"playoffs":1,"championship":1},{"team":"Andy","w":10,"l":3,"pf":1425.7,"pa":1417.3,"playoffs":1,"championship":0},{"team":"Kenley","w":10,"l":3,"pf":1404.8,"pa":1320.3,"playoffs":1,"championship":0},{"team":"Joe","w":8,"l":5,"pf":1501.6,"pa":1401.3,"playoffs":1,"championship":0},{"team":"Mike","w":8,"l":5,"pf":1429.5,"pa":1359.7,"playoffs":1,"championship":0},{"team":"Dave","w":6,"l":7,"pf":1476.5,"pa":1424.3,"playoffs":1,"championship":0},{"team":"Ollie","w":5,"l":8,"pf":1420.8,"pa":1305.2,"playoffs":0,"championship":0},{"team":"Ben","w":5,"l":8,"pf":1369.0,"pa":1401.6,"playoffs":0,"championship":0},{"team":"Jack","w":3,"l":10,"pf":1308.9,"pa":1535.6,"playoffs":0,"championship":0},{"team":"TJ","w":3,"l":10,"pf":1287.9,"pa":1498.4,"playoffs":0,"championship":0}],
  "2017": [{"team":"Ollie","w":10,"l":3,"pf":1577.8,"pa":1253.4,"playoffs":1,"championship":1},{"team":"Mike","w":9,"l":4,"pf":1291.9,"pa":1282.9,"playoffs":1,"championship":0},{"team":"Kenley","w":8,"l":5,"pf":1355.8,"pa":1317.8,"playoffs":1,"championship":0},{"team":"Jack","w":7,"l":6,"pf":1427.8,"pa":1343.0,"playoffs":1,"championship":0},{"team":"Dave","w":7,"l":6,"pf":1380.7,"pa":1320.6,"playoffs":1,"championship":0},{"team":"Andy","w":7,"l":6,"pf":1258.5,"pa":1253.2,"playoffs":1,"championship":0},{"team":"Joe","w":6,"l":7,"pf":1357.9,"pa":1375.5,"playoffs":0,"championship":0},{"team":"Ben","w":4,"l":9,"pf":1226.6,"pa":1326.2,"playoffs":0,"championship":0},{"team":"Kiri","w":4,"l":9,"pf":1185.1,"pa":1408.2,"playoffs":0,"championship":0},{"team":"Bobby","w":3,"l":10,"pf":1200.6,"pa":1382.2,"playoffs":0,"championship":0}],
  "2018": [{"team":"Dave","w":9,"l":4,"pf":1687.3,"pa":1532.6,"playoffs":1,"championship":1},{"team":"Ben","w":9,"l":4,"pf":1464.6,"pa":1519.1,"playoffs":1,"championship":0},{"team":"Joe","w":8,"l":5,"pf":1601.9,"pa":1456.8,"playoffs":1,"championship":0},{"team":"Kiri","w":7,"l":6,"pf":1605.9,"pa":1477.7,"playoffs":1,"championship":0},{"team":"Jack","w":7,"l":6,"pf":1520.3,"pa":1396.8,"playoffs":1,"championship":0},{"team":"Mike","w":6,"l":7,"pf":1493.2,"pa":1486.7,"playoffs":1,"championship":0},{"team":"Ollie","w":5,"l":8,"pf":1569.9,"pa":1516.5,"playoffs":0,"championship":0},{"team":"Andy","w":5,"l":8,"pf":1492.4,"pa":1545.3,"playoffs":0,"championship":0},{"team":"Kenley","w":5,"l":8,"pf":1337.0,"pa":1506.5,"playoffs":0,"championship":0},{"team":"Bobby","w":4,"l":9,"pf":1155.6,"pa":1490.0,"playoffs":0,"championship":0}],
  "2019": [{"team":"Kiri","w":11,"l":2,"pf":1464.4,"pa":1171.62,"playoffs":1,"championship":1},{"team":"Joe","w":10,"l":3,"pf":1538.96,"pa":1338.1,"playoffs":1,"championship":0},{"team":"Ben","w":8,"l":5,"pf":1589.02,"pa":1454.4,"playoffs":1,"championship":0},{"team":"Mike","w":8,"l":5,"pf":1377.02,"pa":1427.2,"playoffs":1,"championship":0},{"team":"Andy","w":7,"l":6,"pf":1556.22,"pa":1423.04,"playoffs":1,"championship":0},{"team":"Ollie","w":6,"l":7,"pf":1388.8,"pa":1447.12,"playoffs":1,"championship":0},{"team":"Dave","w":5,"l":8,"pf":1457.24,"pa":1464.96,"playoffs":0,"championship":0},{"team":"Kenley","w":4,"l":9,"pf":1297.42,"pa":1511.76,"playoffs":0,"championship":0},{"team":"Jack","w":3,"l":10,"pf":1341.1,"pa":1555.46,"playoffs":0,"championship":0},{"team":"Bobby","w":3,"l":10,"pf":1299.58,"pa":1516.1,"playoffs":0,"championship":0}],
  "2020": [{"team":"Jack","w":10,"l":3,"pf":1618.22,"pa":1310.76,"playoffs":1,"championship":1},{"team":"Andy","w":8,"l":5,"pf":1577.8,"pa":1476.28,"playoffs":1,"championship":0},{"team":"Dave","w":8,"l":5,"pf":1565.2,"pa":1387.82,"playoffs":1,"championship":0},{"team":"Joe","w":8,"l":5,"pf":1505.44,"pa":1421.34,"playoffs":1,"championship":0},{"team":"Bobby","w":7,"l":6,"pf":1464.58,"pa":1359.5,"playoffs":1,"championship":0},{"team":"Ollie","w":6,"l":7,"pf":1466.62,"pa":1521.46,"playoffs":1,"championship":0},{"team":"Kiri","w":6,"l":7,"pf":1247.48,"pa":1484.14,"playoffs":0,"championship":0},{"team":"Mike","w":5,"l":8,"pf":1374.98,"pa":1443.58,"playoffs":0,"championship":0},{"team":"Kenley","w":5,"l":8,"pf":1261.1,"pa":1356.4,"playoffs":0,"championship":0},{"team":"Ben","w":2,"l":11,"pf":1098.46,"pa":1418.6,"playoffs":0,"championship":0}],
  "2021": [{"team":"Ben","w":9,"l":5,"pf":1692.5,"pa":1580.9,"playoffs":1,"championship":1},{"team":"Andy","w":9,"l":5,"pf":1491.72,"pa":1367.32,"playoffs":1,"championship":0},{"team":"Joe","w":8,"l":6,"pf":1577.16,"pa":1494.72,"playoffs":1,"championship":0},{"team":"Kiri","w":8,"l":6,"pf":1437.58,"pa":1548.38,"playoffs":1,"championship":0},{"team":"Bobby","w":7,"l":7,"pf":1625.02,"pa":1606.1,"playoffs":1,"championship":0},{"team":"Dave","w":7,"l":7,"pf":1506.12,"pa":1565.46,"playoffs":1,"championship":0},{"team":"Ollie","w":6,"l":8,"pf":1565.42,"pa":1607.08,"playoffs":0,"championship":0},{"team":"Jack","w":6,"l":8,"pf":1553.24,"pa":1552.84,"playoffs":0,"championship":0},{"team":"Mike","w":6,"l":8,"pf":1531.94,"pa":1612.26,"playoffs":0,"championship":0},{"team":"Kenley","w":4,"l":10,"pf":1433.16,"pa":1478.8,"playoffs":0,"championship":0}],
  "2022": [{"team":"Andy","w":8,"l":6,"pf":1572.16,"pa":1462.54,"playoffs":1,"championship":1},{"team":"Ollie","w":10,"l":4,"pf":1775.38,"pa":1507.08,"playoffs":1,"championship":0},{"team":"Joe","w":8,"l":6,"pf":1675.72,"pa":1551.12,"playoffs":1,"championship":0},{"team":"Kenley","w":8,"l":6,"pf":1625.8,"pa":1508.88,"playoffs":1,"championship":0},{"team":"Ben","w":8,"l":6,"pf":1567.7,"pa":1517.76,"playoffs":1,"championship":0},{"team":"Bobby","w":8,"l":6,"pf":1462.66,"pa":1567.46,"playoffs":1,"championship":0},{"team":"Mike","w":5,"l":9,"pf":1499.8,"pa":1534.3,"playoffs":0,"championship":0},{"team":"Jack","w":5,"l":9,"pf":1458.34,"pa":1576.2,"playoffs":0,"championship":0},{"team":"Kiri","w":5,"l":9,"pf":1399.22,"pa":1642.99,"playoffs":0,"championship":0},{"team":"Dave","w":5,"l":9,"pf":1336.86,"pa":1505.3,"playoffs":0,"championship":0}],
  "2023": [{"team":"Mike","w":7,"l":7,"pf":1500.32,"pa":1478.7,"playoffs":1,"championship":1},{"team":"Andy","w":11,"l":3,"pf":1767.12,"pa":1526.66,"playoffs":1,"championship":0},{"team":"Joe","w":10,"l":4,"pf":1609.62,"pa":1314.24,"playoffs":1,"championship":0},{"team":"Jack","w":8,"l":6,"pf":1599.68,"pa":1346.04,"playoffs":1,"championship":0},{"team":"Ollie","w":7,"l":7,"pf":1531.96,"pa":1486.7,"playoffs":1,"championship":0},{"team":"Dave","w":7,"l":7,"pf":1453.4,"pa":1490.62,"playoffs":1,"championship":0},{"team":"Ben","w":7,"l":7,"pf":1416.44,"pa":1506.94,"playoffs":0,"championship":0},{"team":"Kenley","w":6,"l":8,"pf":1419.74,"pa":1655.84,"playoffs":0,"championship":0},{"team":"Kiri","w":5,"l":9,"pf":1393.24,"pa":1533.26,"playoffs":0,"championship":0},{"team":"Bobby","w":2,"l":12,"pf":1320.4,"pa":1672.64,"playoffs":0,"championship":0}],
  "2024": [{"team":"Joe","w":12,"l":2,"pf":1802.94,"pa":1444.8,"playoffs":1,"championship":1},{"team":"Dave","w":10,"l":4,"pf":1621.88,"pa":1562.86,"playoffs":1,"championship":0},{"team":"Ben","w":8,"l":6,"pf":1583.28,"pa":1477.6,"playoffs":1,"championship":0},{"team":"Kiri","w":8,"l":6,"pf":1496.16,"pa":1436.68,"playoffs":1,"championship":0},{"team":"Andy","w":7,"l":7,"pf":1539.18,"pa":1508.7,"playoffs":1,"championship":0},{"team":"Ollie","w":7,"l":7,"pf":1534.36,"pa":1533.54,"playoffs":1,"championship":0},{"team":"Kenley","w":5,"l":9,"pf":1586.72,"pa":1657.02,"playoffs":0,"championship":0},{"team":"Mike","w":5,"l":9,"pf":1399.48,"pa":1583.02,"playoffs":0,"championship":0},{"team":"Jack","w":4,"l":10,"pf":1516.64,"pa":1684.84,"playoffs":0,"championship":0},{"team":"Bobby","w":4,"l":10,"pf":1410.36,"pa":1601.94,"playoffs":0,"championship":0}],
  "2025": [{"team":"Joe","w":11,"l":3,"pf":1740.58,"pa":1532.7,"playoffs":1,"championship":1},{"team":"Bobby","w":10,"l":4,"pf":1728.64,"pa":1531.88,"playoffs":1,"championship":0},{"team":"Mike","w":9,"l":5,"pf":1718.74,"pa":1627.96,"playoffs":1,"championship":0},{"team":"Ben","w":8,"l":6,"pf":1640.44,"pa":1627.96,"playoffs":1,"championship":0},{"team":"Dave","w":8,"l":6,"pf":1615.68,"pa":1593.16,"playoffs":1,"championship":0},{"team":"Ollie","w":7,"l":7,"pf":1678.36,"pa":1644.12,"playoffs":1,"championship":0},{"team":"Jack","w":5,"l":8,"pf":1453.52,"pa":1605.7,"playoffs":0,"championship":0},{"team":"Andy","w":4,"l":10,"pf":1583.92,"pa":1742.28,"playoffs":0,"championship":0},{"team":"Kenley","w":4,"l":10,"pf":1583.92,"pa":1742.28,"playoffs":0,"championship":0},{"team":"Kiri","w":3,"l":11,"pf":1481.72,"pa":1721.52,"playoffs":0,"championship":0}],
}

const OVERALL = [
  {"team":"Joe",   "w":106,"l":69, "seasons":13,"playoffs":10,"championships":2,"win_pct":60.6,"playoff_pct":76.9,"total_pf":19643.8},
  {"team":"Andy",  "w":94, "l":81, "seasons":13,"playoffs":8, "championships":1,"win_pct":53.7,"playoff_pct":61.5,"total_pf":18728.7},
  {"team":"Dave",  "w":92, "l":83, "seasons":13,"playoffs":9, "championships":1,"win_pct":52.6,"playoff_pct":69.2,"total_pf":18931.9},
  {"team":"Mike",  "w":91, "l":83, "seasons":13,"playoffs":9, "championships":2,"win_pct":52.3,"playoff_pct":69.2,"total_pf":18750.9},
  {"team":"Ollie", "w":91, "l":84, "seasons":13,"playoffs":9, "championships":1,"win_pct":52.0,"playoff_pct":69.2,"total_pf":19154.4},
  {"team":"Ben",   "w":88, "l":87, "seasons":13,"playoffs":8, "championships":2,"win_pct":50.3,"playoff_pct":61.5,"total_pf":18295.0},
  {"team":"Kenley","w":79, "l":96, "seasons":13,"playoffs":4, "championships":1,"win_pct":45.1,"playoff_pct":30.8,"total_pf":17879.5},
  {"team":"Bobby", "w":75, "l":98, "seasons":13,"playoffs":6, "championships":1,"win_pct":43.4,"playoff_pct":46.2,"total_pf":17942.5},
  {"team":"Jack",  "w":75, "l":98, "seasons":13,"playoffs":4, "championships":1,"win_pct":43.4,"playoff_pct":30.8,"total_pf":18490.7},
  {"team":"Kiri",  "w":57, "l":65, "seasons":9, "playoffs":4, "championships":1,"win_pct":46.7,"playoff_pct":44.4,"total_pf":12710.8},
  {"team":"TJ",    "w":17, "l":22, "seasons":3, "playoffs":1, "championships":0,"win_pct":43.6,"playoff_pct":33.3,"total_pf":3702.9},
  {"team":"Eric",  "w":7,  "l":7,  "seasons":1, "playoffs":0, "championships":0,"win_pct":50.0,"playoff_pct":0.0, "total_pf":1464.0},
]

const POWER = [
  {"team":"Joe",   "champ_pct":15.4,"playoff_pct":76.9,"win_pct":60.6,"pf_avg":6.50, "power":1.0000,"rank":1},
  {"team":"Mike",  "champ_pct":15.4,"playoff_pct":69.2,"win_pct":52.3,"pf_avg":1.49, "power":0.8308,"rank":2},
  {"team":"Ben",   "champ_pct":15.4,"playoff_pct":61.5,"win_pct":50.3,"pf_avg":-1.33,"power":0.7533,"rank":3},
  {"team":"Ollie", "champ_pct":7.7, "playoff_pct":69.2,"win_pct":52.0,"pf_avg":3.70, "power":0.6464,"rank":4},
  {"team":"Dave",  "champ_pct":7.7, "playoff_pct":69.2,"win_pct":52.6,"pf_avg":2.64, "power":0.6439,"rank":5},
  {"team":"Andy",  "champ_pct":7.7, "playoff_pct":61.5,"win_pct":53.7,"pf_avg":0.91, "power":0.6123,"rank":6},
  {"team":"Kiri",  "champ_pct":11.1,"playoff_pct":44.4,"win_pct":46.7,"pf_avg":-5.14,"power":0.5014,"rank":7},
  {"team":"Bobby", "champ_pct":7.7, "playoff_pct":46.2,"win_pct":43.4,"pf_avg":-3.22,"power":0.3966,"rank":8},
  {"team":"Jack",  "champ_pct":7.7, "playoff_pct":30.8,"win_pct":43.4,"pf_avg":0.03, "power":0.3645,"rank":9},
  {"team":"Kenley","champ_pct":7.7, "playoff_pct":30.8,"win_pct":45.1,"pf_avg":-3.61,"power":0.3540,"rank":10},
  {"team":"Eric",  "champ_pct":0.0, "playoff_pct":0.0, "win_pct":50.0,"pf_avg":5.64, "power":0.1698,"rank":11},
  {"team":"TJ",    "champ_pct":0.0, "playoff_pct":33.3,"win_pct":43.6,"pf_avg":-1.59,"power":0.1633,"rank":12},
]

/* ── Helpers ──────────────────────────────────────────────────────────── */
const SEASON_YEARS = Object.keys(SEASONS).sort((a, b) => b - a)

function getChampion(rows) { return rows.find(r => r.championship)?.team ?? '?' }
function getToilet(rows)   { return rows[rows.length - 1].team }

/* ── Toilet counts (for stat badge) ─────────────────────────────────── */
const toiletCounts = {}
Object.values(SEASONS).forEach(rows => {
  const t = getToilet(rows)
  toiletCounts[t] = (toiletCounts[t] || 0) + 1
})
const worstToiletEntry = Object.entries(toiletCounts).sort((a, b) => b[1] - a[1])[0]

/* ── Unique champions ────────────────────────────────────────────────── */
const uniqueChamps = new Set(Object.values(SEASONS).map(getChampion)).size

/* ── Adjusted power rankings with -10% toilet penalty ───────────────── */
const maxToilets = Math.max(...Object.values(toiletCounts), 1)
const ADJUSTED_POWER = (() => {
  const scored = POWER.map(p => {
    const tc      = toiletCounts[p.team] || 0
    const penalty = 0.1 * (tc / maxToilets)
    return { ...p, toilets: tc, adjustedScore: p.power - penalty }
  }).sort((a, b) => b.adjustedScore - a.adjustedScore)
  const maxScore = scored[0].adjustedScore
  return scored.map((p, i) => ({
    ...p,
    rank:           i + 1,
    normalizedScore: p.adjustedScore / maxScore,
  }))
})()

/* ── Sub-components ───────────────────────────────────────────────────── */

function StatBadge({ value, label }) {
  return (
    <div style={{
      background: 'rgba(107,26,42,0.3)',
      border: '1px solid rgba(200,168,75,0.22)',
      borderRadius: 'var(--card-radius)',
      padding: '14px 20px',
      textAlign: 'center',
      minWidth: '120px',
      flex: '1 1 120px',
    }}>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.5rem',
        color: 'var(--gold-light)',
        lineHeight: 1,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.62rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--cream)',
        opacity: 0.38,
      }}>
        {label}
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '10px 24px',
        background: 'none',
        border: 'none',
        borderBottom: `2px solid ${active ? 'var(--gold)' : 'transparent'}`,
        color: active ? 'var(--gold)' : 'rgba(245,240,232,0.35)',
        cursor: 'pointer',
        marginBottom: '-1px',
        transition: 'color 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

/* ── Champion strip (scrollable year chips) ──────────────────────────── */
function ChampStrip({ selected, onSelect }) {
  return (
    <div style={{ overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
        {SEASON_YEARS.map(year => {
          const champ = getChampion(SEASONS[year])
          const isActive = year === selected
          return (
            <button
              key={year}
              onClick={() => onSelect(year)}
              style={{
                background: isActive ? 'rgba(107,26,42,0.6)' : 'rgba(107,26,42,0.25)',
                border: `1px solid ${isActive ? 'var(--gold)' : 'rgba(200,168,75,0.18)'}`,
                borderRadius: '8px',
                padding: '10px 14px',
                textAlign: 'center',
                minWidth: '88px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                color: isActive ? 'var(--gold)' : 'rgba(200,168,75,0.55)',
                marginBottom: '4px',
              }}>
                {year}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.72rem',
                color: isActive ? 'var(--gold-light)' : 'rgba(245,240,232,0.55)',
              }}>
                {champ}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Season year pills ───────────────────────────────────────────────── */
function SeasonPills({ selected, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.65rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        opacity: 0.6,
        marginRight: '4px',
      }}>
        Season:
      </span>
      {SEASON_YEARS.map(year => {
        const isActive = year === selected
        return (
          <SeasonPill key={year} year={year} active={isActive} onClick={() => onSelect(year)} />
        )
      })}
    </div>
  )
}

function SeasonPill({ year, active, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.78rem',
        fontWeight: 600,
        padding: '4px 12px',
        background: active ? 'rgba(107,26,42,0.6)' : hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? 'var(--gold)' : hov ? 'rgba(200,168,75,0.38)' : 'rgba(200,168,75,0.14)'}`,
        color: active ? 'var(--gold)' : hov ? 'var(--cream)' : 'rgba(245,240,232,0.4)',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {year}
    </button>
  )
}

/* ── Status badge ────────────────────────────────────────────────────── */
function StatusBadge({ type }) {
  if (type === 'champion') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: 'var(--font-serif)', fontSize: '0.68rem',
      color: 'var(--gold-light)',
      background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.3)',
      padding: '2px 9px', borderRadius: '3px',
    }}>
      🏆 Champion
    </span>
  )
  if (type === 'toilet') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: 'var(--font-serif)', fontSize: '0.68rem',
      color: 'rgba(180,100,100,0.8)',
      background: 'rgba(180,60,60,0.08)', border: '1px solid rgba(180,60,60,0.2)',
      padding: '2px 9px', borderRadius: '3px',
    }}>
      🚽 Toilet Bowl
    </span>
  )
  if (type === 'playoff') return (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)', opacity: 0.65 }}>
      Playoffs <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(200,168,75,0.55)', verticalAlign: 'middle', marginLeft: '3px' }} />
    </span>
  )
  return <span style={{ color: 'rgba(245,240,232,0.2)', fontFamily: 'var(--font-body)' }}>—</span>
}

/* ── Table wrapper ───────────────────────────────────────────────────── */
const TH = ({ children, right }) => (
  <th style={{
    fontFamily: 'var(--font-serif)', fontSize: '0.62rem', letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'var(--gold)', padding: '10px 14px',
    borderBottom: '2px solid rgba(200,168,75,0.28)', textAlign: right ? 'right' : 'left',
    whiteSpace: 'nowrap',
  }}>
    {children}
  </th>
)

const TD = ({ children, right, gold, faded, style: extra }) => (
  <td style={{
    padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    borderBottom: '1px solid rgba(245,240,232,0.05)',
    textAlign: right ? 'right' : 'left',
    color: gold ? 'var(--gold)' : faded ? 'rgba(245,240,232,0.3)' : 'var(--cream)',
    ...extra,
  }}>
    {children}
  </td>
)

/* ── Season tab ──────────────────────────────────────────────────────── */
function SeasonTab({ year, onYearChange }) {
  const rows = SEASONS[year]
  const toiletTeam = getToilet(rows)

  return (
    <>
      <SectionLabel>🏆 Champions by Year</SectionLabel>
      <ChampStrip selected={year} onSelect={onYearChange} />
      <SeasonPills selected={year} onSelect={onYearChange} />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <TH>Manager</TH>
              <TH right>W</TH>
              <TH right>L</TH>
              <TH right>Win%</TH>
              <TH right>PF</TH>
              <TH right>PA</TH>
              <TH>Status</TH>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const isChamp   = r.championship === 1
              const isToilet  = r.team === toiletTeam && !isChamp
              const isPlayoff = r.playoffs === 1 && !isChamp
              const winPct    = ((r.w / (r.w + r.l)) * 100).toFixed(1)
              const statusType = isChamp ? 'champion' : isToilet ? 'toilet' : isPlayoff ? 'playoff' : 'none'

              return (
                <tr
                  key={r.team}
                  style={{ background: isChamp ? 'rgba(200,168,75,0.06)' : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = isChamp ? 'rgba(200,168,75,0.12)' : 'rgba(107,26,42,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = isChamp ? 'rgba(200,168,75,0.06)' : 'transparent'}
                >
                  <TD style={{ fontFamily: 'var(--font-serif)', color: isChamp ? 'var(--gold-light)' : 'var(--cream)', fontSize: '0.95rem' }}>
                    {r.team}
                  </TD>
                  <TD right gold={isChamp}>{r.w}</TD>
                  <TD right>{r.l}</TD>
                  <TD right>{winPct}%</TD>
                  <TD right>{r.pf.toFixed(1)}</TD>
                  <TD right faded>{r.pa.toFixed(1)}</TD>
                  <TD><StatusBadge type={statusType} /></TD>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ── All-time tab ────────────────────────────────────────────────────── */
function OverallTab() {
  return (
    <>
      <SectionLabel>📋 All-Time Records — All {SEASON_YEARS.length} Seasons</SectionLabel>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <TH>Manager</TH>
              <TH right>Seasons</TH>
              <TH right>W</TH>
              <TH right>L</TH>
              <TH right>Win%</TH>
              <TH right>Playoffs</TH>
              <TH right>Playoff%</TH>
              <TH right>Titles</TH>
              <TH right>Total PF</TH>
            </tr>
          </thead>
          <tbody>
            {OVERALL.map((p, i) => (
              <tr
                key={p.team}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(107,26,42,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <TD style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem' }}>{p.team}</TD>
                <TD right faded>{p.seasons}</TD>
                <TD right>{p.w}</TD>
                <TD right faded>{p.l}</TD>
                <TD right>{p.win_pct}%</TD>
                <TD right>{p.playoffs}</TD>
                <TD right faded>{p.playoff_pct}%</TD>
                <TD right gold>{p.championships}</TD>
                <TD right>{p.total_pf.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ── Power bar ───────────────────────────────────────────────────────── */
function PowerBar({ value }) {
  const pct = (value * 100).toFixed(1)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--maroon-light), var(--gold))',
          }}
        />
      </div>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem', color: 'var(--gold-light)', minWidth: '36px', textAlign: 'right' }}>
        {pct}
      </span>
    </div>
  )
}

const MEDALS = ['🥇', '🥈', '🥉']

/* ── Power rankings tab ──────────────────────────────────────────────── */
function PowerTab() {
  return (
    <>
      {/* Legend */}
      <div style={{
        display: 'flex', gap: '16px', flexWrap: 'wrap',
        padding: '12px 16px', marginBottom: '20px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(200,168,75,0.1)', borderRadius: '8px',
      }}>
        {[
          ['+40%', 'Championships',      'var(--gold)'],
          ['+30%', 'Playoff Appearances', 'var(--gold)'],
          ['+20%', 'Win Rate',            'var(--gold)'],
          ['+10%', 'Points Above Avg',    'var(--gold)'],
          ['−10%', 'Toilet Bowls',        'rgba(200,100,100,0.85)'],
        ].map(([pct, label, color]) => (
          <span key={label} style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(245,240,232,0.5)' }}>
            <span style={{ color, fontWeight: 600 }}>{pct}</span> {label}
          </span>
        ))}
      </div>

      <SectionLabel>⚡ Power Rankings — All Time</SectionLabel>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <TH>Rank</TH>
              <TH>Manager</TH>
              <TH right>Champ%</TH>
              <TH right>Playoff%</TH>
              <TH right>Win%</TH>
              <TH right>PF Avg</TH>
              <TH right>🚽</TH>
              <TH>Power Score</TH>
            </tr>
          </thead>
          <tbody>
            {ADJUSTED_POWER.map(p => {
              const pfColor = p.pf_avg >= 0 ? 'var(--gold-light)' : 'rgba(200,100,100,0.8)'
              const pfStr   = `${p.pf_avg > 0 ? '+' : ''}${p.pf_avg}`
              return (
                <tr
                  key={p.team}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(107,26,42,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <TD style={{ textAlign: 'center', fontSize: p.rank <= 3 ? '1.2rem' : '1rem', color: p.rank === 1 ? 'var(--gold)' : p.rank === 2 ? '#C0C0C0' : p.rank === 3 ? '#CD7F32' : 'rgba(245,240,232,0.25)', fontFamily: 'var(--font-serif)' }}>
                    {p.rank <= 3 ? MEDALS[p.rank - 1] : `#${p.rank}`}
                  </TD>
                  <TD style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem' }}>{p.team}</TD>
                  <TD right>{p.champ_pct}%</TD>
                  <TD right faded>{p.playoff_pct}%</TD>
                  <TD right>{p.win_pct}%</TD>
                  <TD right style={{ color: pfColor }}>{pfStr}</TD>
                  <TD right style={{ color: p.toilets > 0 ? 'rgba(200,100,100,0.75)' : 'rgba(245,240,232,0.2)' }}>
                    {p.toilets > 0 ? p.toilets : '—'}
                  </TD>
                  <TD><PowerBar value={p.normalizedScore} /></TD>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ── Section label with gold rule ────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      fontFamily: 'var(--font-serif)', fontSize: '0.65rem',
      letterSpacing: '0.25em', textTransform: 'uppercase',
      color: 'var(--gold)', marginBottom: '16px',
    }}>
      {children}
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(200,168,75,0.3), transparent)' }} />
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function Archive() {
  const [tab, setTab]               = useState('season')
  const [selectedYear, setSelectedYear] = useState(SEASON_YEARS[0]) // most recent

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem 6rem' }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3.25rem)',
          color: 'var(--gold-light)',
          textShadow: '0 0 40px rgba(200,168,75,0.3)',
          marginBottom: '8px',
        }}>
          The Archive
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.1em' }}>
          A record of glory and shame since 2013
        </p>
        <div style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '20px auto 0' }} />
      </motion.div>

      {/* ── Stat badges ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}
      >
        <StatBadge value={SEASON_YEARS.length} label="Seasons" />
        <StatBadge value={uniqueChamps} label="Unique Champions" />
        <StatBadge value={`${worstToiletEntry[1]}×`} label={`${worstToiletEntry[0]}'s Toilets`} />
        <StatBadge value="106" label="Joe's Wins" />
      </motion.div>

      {/* ── Tab bar ───────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(200,168,75,0.15)', marginBottom: '24px', display: 'flex', gap: '4px' }}>
        <TabBtn active={tab === 'season'}  onClick={() => setTab('season')}>📅 By Season</TabBtn>
        <TabBtn active={tab === 'overall'} onClick={() => setTab('overall')}>📊 All-Time</TabBtn>
        <TabBtn active={tab === 'power'}   onClick={() => setTab('power')}>⚡ Power Rankings</TabBtn>
      </div>

      {/* ── Tab panels ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'season'  && <SeasonTab  year={selectedYear} onYearChange={setSelectedYear} />}
          {tab === 'overall' && <OverallTab />}
          {tab === 'power'   && <PowerTab />}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
