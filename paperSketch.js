let pencil = '#444'
const pencilMultiplier = random(1, 2)
const pencilThickness =  random(1, 1.3)

async function makeImage() {
    background(255, 248, 245)
    const p1 = p(width / 2, height * .4)
    const p2 = p(width / 2, height * .6)
    path = new Path(p1, p2)
    path.rebuild(10)
    path.segments.forEach(seg => seg.point.x += random(-50, 50));
    path.rebuild(50)
    path.smooth()
    path.strokeColor = pencil

    path.segments.forEach((seg, i) => seg.data = { growth: noise(i / 30)*2 + .5 });
    origPath = path.clone()
    origPath.segments.forEach((seg, i) => seg.data = path.segments[i].data);

    side1StartPath = new Path()
    side1EndPath = new Path()
    for (let i = 0; i < 150; i++) {
        side1StartPath.add(path.firstSegment.point.clone())
        side1EndPath.add(path.lastSegment.point.clone())
        newPath = path.clone()

        newPath.segments.forEach((seg, i) => {
            const prevGrowth = path.segments[i].data.growth
            seg.data = { growth: prevGrowth * (noise(seg.point.x / 5, seg.point.y / 50) * .8 + .6) }
            // seg.data = { growth: prevGrowth * random(.9,1.1) }

            let newPoint = seg.point.add(seg.location.normal.multiply(seg.data.growth))
            newPointLine = new Path.Line(seg.point, newPoint)
            const inters = newPointLine.getIntersections(newPath)
            if (inters.length > 1) {
                newPointLine.splitAt(inters[0].location).remove()
                newPoint = inters[0].point
            }

            seg.point = newPoint
        })

        closedPath = path.clone()
        closedPath.add(closedPath.lastSegment.point.add(-width, 0))
        closedPath.add(closedPath.firstSegment.point.add(-width, 0))
        closedPath.closed = true

        newPathClone = newPath.clone()
        newPathClone.segments = newPathClone.segments.filter(seg => !closedPath.contains(seg.point))
        newPathClone.rebuild(newPath.segments.length - 1)
        newPathClone.segments.forEach((seg, i) => seg.data = newPath.segments[i].data)
        closedPath.remove()

        for (let segI = 0; segI < newPathClone.segments.length - 1; segI++) {
            const seg = newPathClone.segments[segI]
            const nextSeg = newPathClone.segments[segI + 1]
            if (seg.point.getDistance(nextSeg.point) > 150) {
                newSeg = newPathClone.divideAt((seg.location.offset + nextSeg.location.offset) / 2)
                newSeg.data = { growth: (seg.data.growth + nextSeg.data.growth) / 2 }
            }
        }
        newPathClone.smooth()
        drawPath(newPathClone)

        newPathClone.segments.forEach((seg, i) => {
            l = new Path.Line(seg.point, path.segments[i].point)
            drawPath(l)
        })

        path = newPathClone
    }

    side1 = path.clone()
    path = origPath

    side2StartPath = new Path()
    side2EndPath = new Path()
    for (let i = 0; i < 150; i++) {
        side2StartPath.add(path.firstSegment.point.clone())
        side2EndPath.add(path.lastSegment.point.clone())
        newPath = path.clone()

        newPath.segments.forEach((seg, i) => {
            const prevGrowth = path.segments[i].data.growth
            seg.data = { growth: prevGrowth * (noise(seg.point.x / 5, seg.point.y / 50) * .8 + .6) }
            // seg.data = { growth: prevGrowth * random(.9,1.1) }

            let newPoint = seg.point.subtract(seg.location.normal.multiply(seg.data.growth))
            newPointLine = new Path.Line(seg.point, newPoint)
            const inters = newPointLine.getIntersections(newPath)
            if (inters.length > 1) {
                newPointLine.splitAt(inters[0].location).remove()
                newPoint = inters[0].point
            }

            seg.point = newPoint
        })

        closedPath = path.clone()
        closedPath.add(closedPath.lastSegment.point.add(width, 0))
        closedPath.add(closedPath.firstSegment.point.add(width, 0))
        closedPath.closed = true

        newPathClone = newPath.clone()
        newPathClone.segments = newPathClone.segments.filter(seg => !closedPath.contains(seg.point))
        newPathClone.rebuild(newPath.segments.length - 1)
        newPathClone.segments.forEach((seg, i) => seg.data = newPath.segments[i].data)
        closedPath.remove()

        for (let segI = 0; segI < newPathClone.segments.length - 1; segI++) {
            const seg = newPathClone.segments[segI]
            const nextSeg = newPathClone.segments[segI + 1]
            if (seg.point.getDistance(nextSeg.point) > 150) {
                newSeg = newPathClone.divideAt((seg.location.offset + nextSeg.location.offset) / 2)
                newSeg.data = { growth: (seg.data.growth + nextSeg.data.growth) / 2 }
            }
        }
        newPathClone.smooth()
        drawPath(newPathClone)

        newPathClone.segments.forEach((seg, i) => {
            l = new Path.Line(seg.point, path.segments[i].point)
            drawPath(l)
        })

        path = newPathClone
    }

    side2 = path.clone()
    side1EndPath.reverse()
    side2StartPath.reverse()
    side2.reverse()
    border = new Path([...side1StartPath.segments, ...side1.segments, ...side1EndPath.segments, ...side2EndPath.segments,...side2.segments ,...side2StartPath.segments])
    step = .1
    for (let i=0;i<30;i++){
        drawPath(border)
        border = border.offset(step)
        border.simplify()
        step+=.1
    }
}


function embryo() {
    background(255, 248, 245)
    const p1 = p(width / 3, height * .2)
    const p2 = p(width / 3, height * .8)
    path = new Path.Circle(p(width / 2, height / 2), 10).wonky()
    // path = new Path(p1, p2)
    // path.rebuild(10)
    // path.segments.forEach(seg => seg.point.x += random(-50, 50));
    path.rebuild(50)
    path.smooth()
    path.strokeColor = pencil

    path.segments.forEach((seg, i) => seg.data = { growth: noise(i / 30) * 2 });

    for (let i = 0; i < 150; i++) {
        noiseMultiplyer = Math.pow(Math.E, -((i / 75) ** 2) / 1000) * .7
        newPath = path.clone()

        for (let segI = 0; segI < path.segments.length; segI++) {
            const seg = newPath.segments[segI]
            const prevGrowth = path.segments[segI].data.growth
            seg.data = { growth: prevGrowth * (noise(seg.point.x / 50, seg.point.y / 50) * .8 + 0.6) }

            let newPoint = seg.point.add(seg.location.normal.multiply(seg.data.growth))
            newPointLine = new Path.Line(seg.point, newPoint)
            // newPointLine.strokeColor = 'red'
            const inters = newPointLine.getIntersections(newPath)
            if (inters.length > 1) {
                newPointLine.splitAt(inters[0].location).remove()
                newPoint = inters[0].point
            }

            seg.point = newPoint
        }

        closedPath = path.clone()
        closedPath.add(closedPath.lastSegment.point.add(-width, 0))
        closedPath.add(closedPath.firstSegment.point.add(-width, 0))
        closedPath.closed = true

        newPathClone = newPath.clone()
        newPathClone.rebuild(100)
        newPathClone.smooth()
        newPathClone.segments = newPath.segments.filter(seg => !closedPath.contains(seg.point))
        newPathClone.rebuild(newPath.segments.length - 1)
        newPathClone.segments.forEach((seg, i) => seg.data = newPath.segments[i].data)
        closedPath.remove()

        for (let segI = 0; segI < newPathClone.segments.length - 1; segI++) {
            const seg = newPathClone.segments[segI]
            const nextSeg = newPathClone.segments[segI + 1]
            if (seg.point.getDistance(nextSeg.point) > 150) {
                newSeg = newPathClone.divideAt((seg.location.offset + nextSeg.location.offset) / 2)
                newSeg.data = { growth: (seg.data.growth + nextSeg.data.growth) / 2 }
            }
        }
        newPathClone.smooth()
        drawPath(newPathClone)
        path = newPathClone
    }
}