'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Skeleton from '@mui/material/Skeleton';


export default function MemberCenterPage() {
  return (
    <Card className="content-card">
      <CardContent>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
      </CardContent>
    </Card>
  )
}
